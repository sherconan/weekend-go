# Suzhou Image Regen · Next-Day Retry

> 2026-04-19 session 结束时 43/60 Suzhou 图片完成（71.7%）
> ChatGPT 触发 "Image Generation Limit" 每日上限，Gemini 双账号 AuthError 配额耗尽
> 17 张待下一日补齐

## 待生成清单

| File | Name |
|------|------|
| dest-su-1003.webp | 狮子林 |
| dest-su-1029.webp | 苏州博物馆西馆 |
| dest-su-1030.webp | 苏州丝绸博物馆 |
| dest-su-1031.webp | 中国昆曲博物馆 |
| dest-su-1047.webp | 苏州之眼摩天轮 |
| dest-su-1048.webp | 圆融天幕街 |
| dest-su-1049.webp | 太湖西山（金庭镇） |
| dest-su-1050.webp | 太湖东山（洞庭东山） |
| dest-su-1051.webp | 阳澄湖（莲花岛） |
| dest-su-1052.webp | 沙家浜（常熟） |
| dest-su-1053.webp | 常熟虞山（尚湖） |
| dest-su-1054.webp | 斜塘老街 |
| dest-su-1055.webp | 树山村 |
| dest-su-1056.webp | 明月湾古村 |
| dest-su-1057.webp | 黎里古镇 |
| dest-su-1058.webp | 诚品生活苏州 |
| dest-su-1059.webp | 苏州松鹤楼（观前街总店） |

Queue 文件已生成：`suzhou-retry-queue.json`

## 明日起跑方案

### 方案 A：ChatGPT（推荐，上次成功率 ~72%）

```bash
# 1. 确认 Chrome 里 chatgpt.com 主 tab 已登录（非 /skills）
# 2. 临时 patch 脚本让它读 retry queue
cd ~/weekend-go
sed 's|suzhou-regen-queue.json|suzhou-retry-queue.json|' gen-chatgpt-suzhou.py > gen-chatgpt-suzhou-retry.py
nohup python3 gen-chatgpt-suzhou-retry.py --delay 10 > /tmp/weekendgo-suzhou-retry.log 2>&1 &
```

### 方案 B：Gemini（需先刷新 cookies + 访问 gemini.google.com）

```bash
cd ~/weekend-go
# 1. 打开 Chrome 到 gemini.google.com 重新建立会话
# 2. 刷新 cookies
python3 refresh-gemini-cookies.py
# 3. 健康检查
bun ~/.claude/skills/baoyu-danger-gemini-web/scripts/main.ts --prompt "kawaii cat" --image /tmp/h.png --model gemini-3-pro
# 4. 如通过，run retry 队列
cp gen-suzhou-regen.ts gen-suzhou-retry.ts
sed -i '' 's|suzhou-regen-queue.json|suzhou-retry-queue.json|' gen-suzhou-retry.ts
nohup bun gen-suzhou-retry.ts > /tmp/weekendgo-gemini-retry.log 2>&1 &
```

### 方案 C：直接用备用图

代码端 `js/images.js` 的 `getImage()` 已有 gradient fallback，缺图的 dest 会显示"主题渐变色+名字覆盖"——不是硬伤，但视觉一致性弱一些。

## 验收

```bash
cd ~/weekend-go && python3 -c "
import os, json
with open('suzhou-retry-queue.json') as f: q = json.load(f)
done = sum(1 for i in q if os.path.exists('assets/images/'+i['file']) and os.path.getsize('assets/images/'+i['file']) >= 30000)
print(f'{done}/{len(q)} done')"
```

完成后 `git add assets/images/ && git commit && git push`。
