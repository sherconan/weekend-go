#!/usr/bin/env bash
# check-xhs-cookies.sh — Daily XHS cookie freshness check
#
# Reads ~/.mcp/rednote/cookies.json and warns (via notifications inbox) when:
#   - mtime age ≥ 25 days (XHS soft-invalidates ~30d rolling)
#   - any core cookie (web_session/id_token/xsecappid) absolute expiry < 14 days
#
# Cron (see below) runs this daily. Result lands in ~/projects-hub/notifications.json
# which is surfaced by standup/skills when sessions start.
#
# Install:
#   chmod +x ~/weekend-go/scripts/check-xhs-cookies.sh
#   crontab -l 2>/dev/null | grep -v check-xhs-cookies ; echo "30 9 * * * /Users/sherconan/weekend-go/scripts/check-xhs-cookies.sh" | crontab -

set -euo pipefail

COOKIES="$HOME/.mcp/rednote/cookies.json"
THRESHOLD_MTIME_DAYS=25
THRESHOLD_EXPIRY_DAYS=14

source "$HOME/scripts/notify-lib.sh" 2>/dev/null || {
  echo "notify-lib.sh not found — ALERT PIPE BROKEN" >&2
  exit 1
}

if [[ ! -f "$COOKIES" ]]; then
  notify_add "ERROR" "weekend-go" "XHS Cookies Missing" "~/.mcp/rednote/cookies.json not found. XHS harvest tooling will fail." "file://$HOME/weekend-go/xhs-research/"
  exit 1
fi

python3 - <<PY
import json, os, sys, datetime
path = os.path.expanduser('$COOKIES')
cookies = json.load(open(path))

# mtime age
mtime = os.path.getmtime(path)
age_days = (datetime.datetime.now() - datetime.datetime.fromtimestamp(mtime)).days

# min expiry among core cookies
core = {'web_session', 'id_token', 'xsecappid'}
core_exps = []
for c in cookies:
    if c.get('name') in core:
        e = c.get('expires') or c.get('expirationDate')
        if isinstance(e, (int, float)):
            days_left = (datetime.datetime.fromtimestamp(e) - datetime.datetime.now()).days
            core_exps.append((c['name'], days_left))
min_core = min(e for _, e in core_exps) if core_exps else 9999

# emit notification if needed
reason = None
if age_days >= $THRESHOLD_MTIME_DAYS:
    reason = f'cookies.json 已 {age_days} 天未更新，XHS 软失效窗 30 天，建议重新登录刷 cookies'
elif min_core < $THRESHOLD_EXPIRY_DAYS:
    reason = f'core cookie 最短剩余 {min_core} 天，即将过期'

if reason:
    # write to notifications.json via notify-lib
    os.system(f'source $HOME/scripts/notify-lib.sh && notify_add WARNING weekend-go "XHS Cookies 即将到期" "{reason}" "file:///Users/sherconan/weekend-go/xhs-research/"')
    print(f'ALERT: {reason}', file=sys.stderr)
    sys.exit(2)

print(f'ok: mtime age={age_days}d, core cookie min expiry={min_core}d')
PY
