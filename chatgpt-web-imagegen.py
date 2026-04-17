#!/usr/bin/env python3
"""ChatGPT Web image generation via Chrome AppleScript + sync XHR.
Runs JS in user's logged-in Chrome tab on chatgpt.com."""
import json, os, sys, time, subprocess, argparse, base64

def chrome_js(js_code, timeout=30):
    """Execute synchronous JavaScript in Chrome's active chatgpt.com tab."""
    # Write JS to temp file to avoid escaping issues
    tmp = '/tmp/_chatgpt_js_cmd.js'
    with open(tmp, 'w') as f:
        f.write(js_code)

    applescript = f'''
    set jsCode to read POSIX file "{tmp}" as «class utf8»
    tell application "Google Chrome"
        set theTab to missing value
        repeat with w in windows
            repeat with t in tabs of w
                if URL of t starts with "https://chatgpt.com" then
                    set theTab to t
                    exit repeat
                end if
            end repeat
            if theTab is not missing value then exit repeat
        end repeat
        if theTab is missing value then
            return "ERR:no_chatgpt_tab"
        end if
        set jsResult to execute theTab javascript jsCode
        return jsResult
    end tell
    '''

    result = subprocess.run(
        ['osascript', '-e', applescript],
        capture_output=True, text=True, timeout=timeout
    )
    os.unlink(tmp)

    if result.returncode != 0:
        return f"ERR:applescript:{result.stderr[:200]}"
    return result.stdout.strip()


def get_token():
    """Get ChatGPT access token via sync XHR."""
    js = """
    (function() {
        var x = new XMLHttpRequest();
        x.open('GET', '/api/auth/session', false);
        x.send();
        if (x.status !== 200) return 'ERR:session_' + x.status;
        var d = JSON.parse(x.responseText);
        return d.accessToken || 'ERR:no_token';
    })()
    """
    result = chrome_js(js)
    if result.startswith('ERR:'):
        print(f"Token error: {result}", file=sys.stderr)
        return None
    return result


def generate_image(prompt, output_path):
    """Generate image via ChatGPT conversation API."""
    print("Getting access token...", file=sys.stderr)
    token = get_token()
    if not token:
        return False
    print(f"Token OK ({len(token)} chars)", file=sys.stderr)

    # Step 1: Create conversation (async, poll via title)
    print("Sending image gen request (30-90s)...", file=sys.stderr)

    # Use a polling approach: start async request, poll document.title for result
    start_js = """
    (function() {
        window._cgResult = null;
        window._cgConvId = null;
        window._cgImgUrls = [];

        var token = """ + json.dumps(token) + """;
        var prompt = """ + json.dumps(prompt) + """;

        var msgId = crypto.randomUUID();
        var parentId = crypto.randomUUID();

        fetch('/backend-api/conversation', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream',
            },
            body: JSON.stringify({
                action: 'next',
                messages: [{
                    id: msgId,
                    author: { role: 'user' },
                    content: { content_type: 'text', parts: [prompt] },
                    metadata: {},
                }],
                parent_message_id: parentId,
                model: 'auto',
                timezone_offset_min: -480,
                conversation_mode: { kind: 'primary_assistant' },
                websocket_request_id: crypto.randomUUID(),
            }),
        }).then(function(resp) {
            if (!resp.ok) {
                resp.text().then(function(t) {
                    window._cgResult = 'ERR:conv_' + resp.status + ':' + t.slice(0, 200);
                });
                return;
            }
            var reader = resp.body.getReader();
            var decoder = new TextDecoder();
            var buffer = '';

            function read() {
                reader.read().then(function(result) {
                    if (result.done) {
                        // Stream ended, check if we have images
                        if (window._cgImgUrls.length > 0) {
                            window._cgResult = 'OK:' + window._cgImgUrls.length;
                        } else if (window._cgConvId) {
                            // Fetch conversation for images
                            fetch('/backend-api/conversation/' + window._cgConvId, {
                                headers: { 'Authorization': 'Bearer ' + token },
                            }).then(function(r) { return r.json(); }).then(function(cd) {
                                var mapping = cd.mapping || {};
                                for (var k in mapping) {
                                    var m = mapping[k].message;
                                    if (!m) continue;
                                    var parts = (m.content || {}).parts || [];
                                    for (var i = 0; i < parts.length; i++) {
                                        var p = parts[i];
                                        if (typeof p === 'object' && p && (p.asset_pointer || '').indexOf('file-service') >= 0) {
                                            window._cgImgUrls.push(p.asset_pointer);
                                        }
                                    }
                                }
                                window._cgResult = window._cgImgUrls.length > 0 ? 'OK:' + window._cgImgUrls.length : 'ERR:no_images';
                            });
                        } else {
                            window._cgResult = 'ERR:no_conv_id';
                        }
                        return;
                    }
                    buffer += decoder.decode(result.value, { stream: true });
                    var lines = buffer.split('\\n');
                    buffer = lines.pop();
                    for (var j = 0; j < lines.length; j++) {
                        var line = lines[j];
                        if (line.indexOf('data: ') !== 0) continue;
                        var ds = line.slice(6);
                        if (ds === '[DONE]') continue;
                        try {
                            var data = JSON.parse(ds);
                            if (data.conversation_id) window._cgConvId = data.conversation_id;
                            var parts2 = ((data.message || {}).content || {}).parts || [];
                            for (var k2 = 0; k2 < parts2.length; k2++) {
                                var pp = parts2[k2];
                                if (typeof pp === 'object' && pp && (pp.asset_pointer || '').indexOf('file-service') >= 0) {
                                    window._cgImgUrls.push(pp.asset_pointer);
                                }
                            }
                        } catch(e) {}
                    }
                    read();
                });
            }
            read();
        }).catch(function(e) {
            window._cgResult = 'ERR:fetch:' + e.message;
        });

        return 'STARTED';
    })()
    """

    r = chrome_js(start_js)
    if r != 'STARTED':
        print(f"ERR: Start failed: {r}", file=sys.stderr)
        return False

    # Poll for completion
    for i in range(120):  # max 120 * 2s = 240s
        time.sleep(2)
        status = chrome_js("window._cgResult || 'PENDING'")
        if status == 'PENDING':
            if i % 15 == 0 and i > 0:
                print(f"  ...waiting ({i*2}s)", file=sys.stderr)
            continue
        break
    else:
        print("ERR: Timeout after 240s", file=sys.stderr)
        return False

    if not status.startswith('OK:'):
        print(f"ERR: {status}", file=sys.stderr)
        return False

    print(f"Image generated! ({status})", file=sys.stderr)

    # Step 2: Download image via sync XHR with arraybuffer
    dl_js = """
    (function() {
        if (!window._cgImgUrls || window._cgImgUrls.length === 0) return 'ERR:no_urls';
        var imgUrl = window._cgImgUrls[0];
        if (imgUrl.indexOf('file-service://') >= 0) {
            imgUrl = '/backend-api/files/' + imgUrl.replace('file-service://', '') + '/download';
        }
        var x = new XMLHttpRequest();
        x.open('GET', imgUrl, false);
        x.setRequestHeader('Authorization', 'Bearer ' + (""" + json.dumps(token) + """));
        x.responseType = 'arraybuffer';
        x.send();
        if (x.status !== 200) return 'ERR:dl_' + x.status;
        var bytes = new Uint8Array(x.response);
        var binary = '';
        for (var i = 0; i < bytes.length; i += 1024) {
            var chunk = bytes.slice(i, Math.min(i + 1024, bytes.length));
            binary += String.fromCharCode.apply(null, chunk);
        }
        return 'DATA:' + btoa(binary);
    })()
    """

    print("Downloading image...", file=sys.stderr)
    dl_result = chrome_js(dl_js, timeout=60)

    if not dl_result.startswith('DATA:'):
        print(f"ERR: Download: {dl_result[:200]}", file=sys.stderr)
        return False

    b64 = dl_result[5:]
    img_bytes = base64.b64decode(b64)
    with open(output_path, 'wb') as f:
        f.write(img_bytes)
    print(f"OK: {output_path} ({len(img_bytes)//1024}KB)", file=sys.stderr)

    # Cleanup conversation
    conv_id = chrome_js("window._cgConvId || ''")
    if conv_id and not conv_id.startswith('ERR:'):
        chrome_js(f"""
        (function() {{
            fetch('/backend-api/conversation/{conv_id}', {{
                method: 'PATCH',
                headers: {{ 'Authorization': 'Bearer ' + ({json.dumps(token)}), 'Content-Type': 'application/json' }},
                body: JSON.stringify({{ is_visible: false }}),
            }});
            return 'OK';
        }})()
        """)

    return True


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='ChatGPT Web Image Gen (Chrome AppleScript)')
    parser.add_argument('--prompt', '-p', required=True)
    parser.add_argument('--image', '-o', required=True)
    args = parser.parse_args()

    success = generate_image(args.prompt, args.image)
    sys.exit(0 if success else 1)
