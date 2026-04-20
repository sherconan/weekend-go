// Navigate ChatGPT to "周末去哪儿玩" project and start a fresh chat inside it.
// Returns:
//   "OK:entered_project" - clicked project, then clicked new-chat
//   "OK:already_in_project:new_chat" - already on project page, clicked new-chat
//   "ERR:project_not_found_in_sidebar"
//   "ERR:new_chat_btn_not_found"
(function() {
  var PROJECT_NAME = '周末去哪儿玩';
  var url = location.href;

  // Check if already inside the project (URL pattern: /g/g-p-XXX-...)
  var onProjectPage = /\/g\/g-p-[a-zA-Z0-9]+/.test(url);

  function clickNewChatInProject() {
    // Try common selectors for "new chat in project" button
    var candidates = [
      document.querySelector('a[data-testid="new-chat-button-in-project"]'),
      document.querySelector('button[data-testid*="new-chat"]'),
      document.querySelector('a[href*="/g/g-p-"][href$="/project"] + * button'),
    ].filter(Boolean);
    for (var c of candidates) { c.click(); return true; }

    // Fallback: scan all buttons/anchors for text match
    var candidateTexts = ['新聊天', '新对话', '新建聊天', '新建对话', 'New chat', 'New conversation'];
    var all = document.querySelectorAll('button, a');
    for (var el of all) {
      var t = (el.innerText || el.textContent || '').trim();
      for (var ct of candidateTexts) {
        if (t === ct || t.startsWith(ct)) { el.click(); return true; }
      }
    }
    return false;
  }

  if (onProjectPage) {
    // Verify it's the right project by checking page heading
    var heading = document.querySelector('h1, h2, [role="heading"]');
    var heading_text = heading ? (heading.innerText || '').trim() : '';
    if (heading_text.indexOf(PROJECT_NAME) < 0) {
      // On a DIFFERENT project — need to switch. Fall through to sidebar search.
      onProjectPage = false;
    } else {
      return clickNewChatInProject() ? 'OK:already_in_project:new_chat' : 'ERR:new_chat_btn_not_found';
    }
  }

  // Scan sidebar anchors for the project name
  var links = document.querySelectorAll('nav a, aside a, [role="navigation"] a, a[href*="/g/g-p-"]');
  var projectLink = null;
  for (var a of links) {
    var text = (a.innerText || a.textContent || '').trim();
    if (text === PROJECT_NAME || text.indexOf(PROJECT_NAME) >= 0) {
      projectLink = a;
      break;
    }
  }
  if (!projectLink) return 'ERR:project_not_found_in_sidebar';

  projectLink.click();
  // React router will navigate; we return OK and caller sleeps before next step
  return 'OK:entered_project';
})()
