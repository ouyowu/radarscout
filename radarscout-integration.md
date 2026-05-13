# RadarScout ↔ Thailand Nightlife Intelligence — Integration Spec
# 这份文档由 Claude (thainight CTO) 编写，供 Codex (RadarScout CTO) 执行
# Last updated: May 2026

---

## 两个项目的分工

| 项目 | 路径 | 职责 | 负责 AI |
|---|---|---|---|
| RadarScout | `/Users/ouyowu/reddit-monitor` | 情报采集、AI 评分、Feed 输出 | Codex |
| thainight | `/Users/ouyowu/Documents/bangkok-nightlife-guide` | 场馆展示、SEO、用户社区 | Claude |

**数据流向：**
```
Reddit/社交媒体
      ↓
  RadarScout (采集 + AI 评分)
      ↓
  /api/thainight/intelligence (JSON/RSS)
      ↓
  thainight (消费 + 展示)
      ↓
  用户看到"情报信号" → 点击场馆详情页
```

---

## RadarScout 已完成的部分（Codex 确认）

- [x] 采集 subreddits: ThailandTourism, Bangkok, Pattaya, phuket, chiangmai
- [x] AI 评分维度: city, type, travel_intent, credibility, thainight_value
- [x] GET /api/thainight/intelligence (JSON)
- [x] GET /api/thainight/intelligence?format=rss (RSS)
- [x] DB migration 字段已加，Railway 部署后需跑 `prisma migrate deploy`

---

## Codex 需要完成的任务（按优先级）

### TASK 1: 确认并文档化 Feed 的精确 JSON Schema

thainight 需要知道 feed 返回的精确字段，才能写消费代码。

请在 RadarScout 里创建 `/docs/feed-schema.json`，内容是一个真实的 response 示例：

```json
{
  "generated_at": "2026-05-12T10:00:00Z",
  "total": 47,
  "items": [
    {
      "id": "reddit_post_abc123",
      "source": "reddit",
      "subreddit": "Bangkok",
      "title": "Best cocktail bars in Thonglor that aren't tourist traps?",
      "url": "https://reddit.com/r/Bangkok/...",
      "body_snippet": "First 300 chars of post...",
      "author": "u/nomad_jake",
      "posted_at": "2026-05-11T22:15:00Z",
      "score": 234,
      "comment_count": 18,

      "ai_scores": {
        "city": "bangkok",
        "area": "thonglor",
        "venue_type": "cocktail-bar",
        "travel_intent": 0.85,
        "credibility": 0.72,
        "thainight_value": 0.91,
        "sentiment": "positive",
        "extracted_venue_names": ["Rabbit Hole", "Vesper"]
      },

      "thainight_match": {
        "matched": true,
        "venue_slug": "rabbit-hole-bar-eatery",
        "venue_name": "Rabbit Hole Bar & Eatery",
        "confidence": 0.88
      }
    }
  ]
}
```

如果实际字段不同，以实际为准，但请确保包含：
- `ai_scores.city` — 必须是 "bangkok" | "pattaya" | "phuket" | "chiang-mai"
- `ai_scores.thainight_value` — 0-1 float，这是 thainight 用来排序的主要信号
- `ai_scores.extracted_venue_names` — 字符串数组，thainight 用来模糊匹配场馆
- `thainight_match.venue_slug` — 如果能匹配到 thainight 的场馆，填 slug；否则 null

---

### TASK 2: 实现场馆名模糊匹配逻辑

当 AI 从 Reddit 帖子里提取出 venue name 后，RadarScout 需要尝试匹配到 thainight 的场馆库。

**匹配方式（按优先级）：**

1. **精确匹配**：extracted name 完全等于 thainight 场馆名
2. **模糊匹配**：用 Levenshtein distance ≤ 2，或包含关系（"Rabbit Hole" 在 "Rabbit Hole Bar & Eatery" 里）
3. **无匹配**：`thainight_match: { matched: false, venue_slug: null, confidence: 0 }`

**实现位置：** `packages/matcher/src/index.ts`（已存在，扩展它）

**场馆数据来源：** 调用 thainight 的 `/api/venues` 接口（见下方 thainight 已提供的接口），或者本地缓存一份 venues list JSON 文件（路径：`/data/thainight-venues.json`，每24小时刷新一次）。

**缓存刷新脚本建议：**
```typescript
// scripts/sync-thainight-venues.ts
// 每天凌晨跑一次，把 thainight 的场馆列表同步到本地
const res = await fetch("https://thainightlife.com/api/venues");
const venues = await res.json();
fs.writeFileSync("./data/thainight-venues.json", JSON.stringify(venues));
```

---

### TASK 3: 在 Feed 接口加 Query 参数支持

thainight 需要按城市、类型、评分门槛筛选：

```
GET /api/thainight/intelligence
  ?city=bangkok           # 过滤城市
  ?min_value=0.7          # thainight_value 最低分
  ?venue_type=cocktail-bar
  ?matched_only=true      # 只返回已匹配到 thainight 场馆的条目
  ?limit=20
  ?offset=0
  ?format=rss             # 返回 RSS 格式
```

---

### TASK 4: Webhook 推送（可选但重要）

当一条情报的 `thainight_value >= 0.85` 时，主动推送给 thainight，不需要 thainight 轮询。

推送目标：`POST https://thainightlife.com/api/radarscout/webhook`
Body:
```json
{
  "secret": "RADARSCOUT_WEBHOOK_SECRET",  // 双方共享，存在 .env
  "item": { ...单条情报对象... }
}
```

推送条件：
- `thainight_value >= 0.85`
- 或 `ai_scores.sentiment == "negative"` 且包含 "closed" / "raid" / "scam" 关键词（这是 raid alert 的来源）

---

### TASK 5: Railway 部署清单（Codex 执行）

```bash
# 1. 确保 .env 有这些变量
THAINIGHT_API_URL=https://thainightlife.com
THAINIGHT_WEBHOOK_SECRET=生成一个随机32位字符串
RADARSCOUT_FEED_API_KEY=另一个随机32位字符串  # thainight 调用 feed 时带这个 key

# 2. 跑 migration
pnpm --filter @reddit-monitor/db exec prisma migrate deploy

# 3. 确认 feed 接口可访问
curl https://你的radarscout域名/api/thainight/intelligence?limit=3
```

---

## thainight 已提供 / 将提供的接口（Claude 负责）

### GET /api/venues
返回所有已发布场馆的简要信息，供 RadarScout 做场馆匹配用。

Response:
```json
[
  {
    "slug": "rabbit-hole-bar-eatery",
    "name": "Rabbit Hole Bar & Eatery",
    "city": "bangkok",
    "area_slug": "thonglor",
    "category": "cocktail-bar",
    "tags": ["cocktails", "date-night", "creative-crowd"]
  }
]
```

### POST /api/radarscout/webhook
接收 RadarScout 的高价值情报推送。

Request:
```json
{
  "secret": "RADARSCOUT_WEBHOOK_SECRET",
  "item": { ...情报对象... }
}
```

Response: `{ "received": true }`

副作用：
- 如果 item 包含 "raid" / "closed" / "police" 关键词 → 触发 Telegram raid alert
- 如果匹配到已知场馆 → 在场馆详情页显示"情报信号"角标

---

## thainight 消费 RadarScout 的展示逻辑（Claude 实现）

### 1. 首页"情报信号" Feed 模块
位置：城市页面（/bangkok 等）顶部，venue card 网格上方

显示内容：最近 24 小时内 `thainight_value >= 0.7` 的条目
UI：横向滚动卡片，每张卡片显示：
- Reddit 帖子标题（截断到 60 字符）
- 来源 subreddit
- 场馆匹配结果（如果有）→ 点击跳转到 `/bangkok/bars/thonglor/rabbit-hole-bar-eatery`
- `thainight_value` 显示为信号强度条

### 2. 场馆详情页"社区情报"模块
位置：VenueScoreCard 下方

显示内容：最近 30 天内提到这个场馆的 Reddit 帖子
数据来源：调用 `/api/thainight/intelligence?venue_slug=rabbit-hole-bar-eatery`

### 3. Raid Alert 接入
当 RadarScout webhook 推送包含 raid 关键词时：
→ thainight 自动推送 Telegram 消息
→ 在对应场馆页面显示红色警告角标
→ 在首页 feed 置顶显示

---

## 环境变量对照表

| 变量名 | 存在项目 | 说明 |
|---|---|---|
| `RADARSCOUT_FEED_URL` | thainight `.env.local` | RadarScout feed 的完整 URL |
| `RADARSCOUT_API_KEY` | thainight `.env.local` | 调用 feed 时的认证 key |
| `RADARSCOUT_WEBHOOK_SECRET` | 两个项目都要 | webhook 验签 |
| `THAINIGHT_API_URL` | RadarScout `.env` | thainight 域名 |
| `THAINIGHT_WEBHOOK_SECRET` | RadarScout `.env` | 同上 |

---

## 验证检查清单（两边都要过）

### RadarScout 端（Codex 验证）
- [ ] `curl /api/thainight/intelligence` 返回正确 JSON schema
- [ ] `curl /api/thainight/intelligence?format=rss` 返回合法 RSS XML
- [ ] `curl /api/thainight/intelligence?city=bangkok&matched_only=true` 正确过滤
- [ ] 高价值情报触发 webhook POST 到 thainight
- [ ] `pnpm --filter @reddit-monitor/web build` 通过

### thainight 端（Claude 验证）
- [ ] `GET /api/venues` 返回场馆列表
- [ ] `POST /api/radarscout/webhook` 正确接收并触发 Telegram
- [ ] 首页情报 feed 模块正确显示
- [ ] 场馆详情页社区情报模块正确显示

---

## 沟通协议

当 Codex 完成 TASK 1-3 后，把实际的 feed schema 更新到这份文档里。
Claude 会根据实际 schema 写 thainight 的消费代码，不依赖假设。

如果 RadarScout 的字段名和这份文档里的不一样，以 RadarScout 实际输出为准，
更新文档后通知 Claude（通过用户转达）。
