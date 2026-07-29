# RadarScout 统一产品与技术架构 v2

状态：Phase 1 当前规格
更新时间：2026-07-29
目标：先证明 reviewed Thailand day-tour catalogue 能产生真实流量与 affiliate handoff 点击，再扩系统。

## 0. 来源与优先级

发生冲突时按以下顺序判断：

1. 当前仓库代码与测试事实；
2. `AGENTS.md` 与 `CLAUDE.md` 的安全规则；
3. `docs/radarscout-codex-goal-cn.md` 的目标和阶段门；
4. 本文件的产品架构；
5. `docs/page-spec.md`、`content-model.md`、`component-map.md`、
   `radarscout-frontend-design.md`、`sitemap.md`；
6. `docs/radarscout-codex-task-queue.md` 的执行任务。

发现文档与代码不一致时先修文档，不建立平行实现。

## 1. 定位

RadarScout 是面向英文自由行游客的泰国城市一日游规划与比较产品。

核心价值：

- 帮用户把模糊旅行想法整理成城市、天数和兴趣；
- 用确定性逻辑给出可理解的逐日结构；
- 匹配人工审核的真实泰国体验；
- 把用户安全交给外部平台完成价格、可用性、付款与确认。

商业模式以 affiliate commission 为主。普通用户免费，不做普通消费者月订阅。
未来可测试一次性高级报告；B2B 订阅只在真实需求出现后讨论。

## 2. 当前事实基线

截至 2026-07-26，最新安全开发与生产基线均为
`origin/codex/travel-mvp-launch@ca6596729c6d2003abded1822fccc25896880f4d`；
生产部署为 `dpl_Hpe1bDEfjD5YDaT1Axeo39zLrjxj`。后续仍须逐次只读确认，
不能从 git 状态推断生产状态。

代码事实：

- Next.js App Router + TypeScript + Tailwind；
- PostgreSQL + Prisma ORM；托管平台是否为 Supabase 需从实际项目确认；
- 205 条人工审核 Viator affiliate seed，覆盖 19 个泰国城市/区域；
- public Planner/product matching 为 Viator-first；
- Vercel Web Analytics 已在 root layout 中接入；
- `booking_partner_handoff_clicked` 已在 Planner、finder 和产品详情 CTA 触发；
- 6 个经人工批准的 `tourDetailSeoCandidates` 已上线；其他产品详情默认
  `noindex, nofollow`；
- sitemap 由静态安全路由和该 candidate allowlist 生成；
- Planner 已使用人工审核的区域坐标显示 MapLibre 地图；没有覆盖时
  fail-closed，不显示推测坐标；
- 经人工审核的 Agoda stay-area 建议和服务端 affiliate deeplink 已上线；
- legacy Bókun、Stripe、reddit-monitor crawler 等表面仍在仓库，但不属于当前公开产品路径；
- 产品 seed 本身不携带精确地点坐标；地图使用独立的人工审核区域覆盖，
  只作方向参考，不表示产品路线、接送点或集合点。

这里的数量和 SHA 是审计快照，不是永久常量。每个任务 Step 0 必须重查。

## 3. 核心架构

```text
Traveler prompt / guided choices
  → deterministic intent parser
  → TripSpec
  → reviewed Viator product retrieval
  → deterministic matching and ranking
  → N-day itinerary slots
  → product/detail comparison
  → Check availability
  → Viator affiliate handoff
```

### 3.1 AI 边界

- Planner 的事实检索与产品匹配不依赖 LLM。
- LLM 只能用于可选的语言表达，不得生成产品、价格、地点、坐标或可用性。
- 没有模型 key 时，核心产品必须完整可用。
- 不为了“AI 感”引入有成本的默认运行时调用。

### 3.2 行程天数

请求 N 天时，返回结构必须包含 N 个 day slot。

当审核产品不足时：

- 可以重复使用 planning category 或显示 planning-only empty slot；
- 不得伪造产品、地点或活动；
- UI 要诚实说明当前 reviewed coverage 不足。

### 3.3 地图

Phase 1 已启用受控地图工作区：

- MapLibre GL；
- MapTiler/OSM 底图；
- 只有明确允许公开的 MapTiler public token 可进入浏览器；
- 坐标来自独立的人工审核区域覆盖，不从 Viator 产品文案推断；
- 不做地理编码；
- 禁止 `(0,0)` 回落；
- 地图必须有等价列表/时间线；
- 页面必须说明地图只用于区域方向，不是精确路线、接送点或集合点；
- 未覆盖城市 fail-closed，显示暂无已审核地图覆盖。

## 4. 前端与信息架构

权威页面规格：

- `docs/page-spec.md`
- `docs/component-map.md`
- `docs/content-model.md`
- `docs/radarscout-frontend-design.md`
- `docs/sitemap.md`
- `docs/acceptance-checklist.md`

当前真实路由：

- `/`
- `/planner`
- `/ai-trip-planner`
- `/tours`
- `/tours/[id]`
- `/destinations`
- `/destinations/[slug]`
- `/chiang-mai/elephant-camp-finder`

不得为 Phase 1 新造 `/trip-planner` 或
`/itineraries/thailand/{city}/{days}-days` 平行路由。

界面结构可以参考 EasyTripAI、Wonderplan 或 Monkey Travel 的信息层级，
但不得复制其代码、资产、文案或独特视觉表达。

## 5. Viator 数据与授权

### 5.1 当前允许路径

- 使用已批准的 API access 做只读开发和候选审查；
- 只将人工审核、字段收窄后的静态 seed 用于公开匹配；
- affiliate URL 必须包含正确账户参数并通过 URL validator；
- 用户点击后在 Viator 完成后续交易。

### 5.2 授权硬闸门

Viator Full Access 申请状态不等于内容 SEO 授权。

在开放任何产品详情索引前，必须得到书面答复：

- 标题、描述、图片可以如何公开展示；
- 是否允许缓存、缓存多久、如何更新；
- 是否要求署名；
- affiliate/deep-link 参数要求；
- “Viator unique content must not be indexed”具体覆盖哪些字段；
- RadarScout 原创编辑内容与 Viator 产品链接组合时是否允许索引。

没有答复时：

- 产品详情保持 `noindex`；
- 不把 Viator unique content 加入可索引 sitemap；
- 不推断或批量开放全部 205 个页面。

### 5.3 审核流程

```text
read-only API candidate
  → Thailand eligibility
  → forbidden-field removal
  → human product review
  → static reviewed seed
  → public matching
  → optional separate SEO-candidate review
```

产品审核与 SEO candidate 审核是两个不同门禁。

## 6. SEO

现有机制必须复用：

- `tourDetailSeoCandidates`
- `getTourDetailRobots`
- sitemap candidate generation
- cross-route index policy guard

首轮 SEO 解锁已完成 6 个页面：

- 用户已逐个批准 id；
- 页面有 RadarScout 原创、实用且非重复的编辑内容；
- canonical path 固定；
- 记录 `reviewedBy`、`approvedAt`、`reviewNote`；
- 未批准产品保持 `noindex`。

该批 SEO 解锁由 `TD-RADARSCOUT-SEO-CANDIDATE-UNLOCK-2B` 完成。任何新增
candidate 仍需独立人工审批。

## 7. Analytics

批准的唯一 provider 是 Vercel Web Analytics。

北极星事件：

- `booking_partner_handoff_clicked`

支持事件：

- homepage entry；
- planner viewed/choice/reset；
- matching requested；
- recommendations rendered。

事件不得包含：

- PII；
- 原始 prompt；
- 完整 affiliate URL；
- 价格、库存、可用性；
- 评分、评论；
- checkout、payment 或 booking state。

“代码已经发送事件”和“当前 dashboard 可读取事件”是两个不同验收项。
若当前 Vercel 套餐不展示 custom events，记录限制并由用户决定是否升级；
不得自动引入第二个 provider。

## 8. 数据层

当前应用访问层继续使用 Prisma ORM。不要把 Supabase 和 Prisma当成二选一：

- Supabase 可以是 PostgreSQL 托管平台；
- Prisma 是应用数据访问层。

融合其他项目之前必须确认：

1. 是否为同一个 Supabase project；
2. 是否存在要迁移的真实数据；
3. schema 归属；
4. 备份与回滚。

任何 schema、migration、真实数据迁移或生产连接都是单独审批任务。

Phase 1 不新建数据表。205 条 reviewed Viator seed 继续作为受控静态资产。

## 9. Thainight 与 Agoda

Thainight 融合仍不是 Phase 1 工作。Agoda 已以收窄后的 affiliate handoff
形式进入 Phase 1，但没有酒店目录 API、实时价格、库存或站内预订。

当前方向：

- RadarScout 做旅行规划与活动；
- 住宿命名空间使用 `stay` / `accommodation`，避免与旧
  `/api/thainight/intelligence` 混淆；
- 复用经过安全审查的 Agoda deeplink 和 reviewed stay-area strategy；
- 访问层统一 Prisma；
- fixture handoff、公开 CID、认证 fail-open、0 价格和 `(0,0)` 坐标问题
  必须先修复；
- 是否 301 thainight.co 由用户单独决定。

只有 Phase 1 累积至少两周真实点击数据后，才评估扩大 Agoda 覆盖或接入
酒店数据能力。

## 10. Reality Check

Reality Check 只在真实数据证明需要后开发。优先不衰减规则：

- 地理距离与聚类；
- 单日时长预算；
- 月度季节/气候提示；
- 儿童年龄段适配。

不承诺营业时间、实时价格、实时拥挤、临时关闭或安全保证。

## 11. Legacy 表面

以下表面不自动删除，也不自动恢复：

- Bókun API/sync/product mappings；
- Stripe；
- reddit-monitor crawler/campaigns；
- local AI reviewed-enrichment migration；
- `/api/thainight/intelligence`。

每个表面单独做 read-only usage audit，再由用户决定 retain / quarantine /
remove。当前公开 Planner 不得回退到 Bókun。

所有 secret 守卫必须 fail-closed，禁止 query-string token。

## 12. Phase 1 验收

### 产品

- 首页 → Planner → N-day structure → reviewed product → detail →
  `Check availability` 可完整完成；
- Planner 只显示审核后的 Thailand products；
- 缺产品时诚实降级，不伪造；
- 没有站内结账、支付、库存、确认或可用性声明；
- 没有地图或未经审核坐标。

### Handoff

- affiliate URL 通过 allowlist/validator；
- `rel="nofollow sponsored noopener noreferrer"`；
- 用户理解 RadarScout 是比较与规划层，交易由外部平台处理。

### Analytics

- 普通浏览器真实访问产生 pageview；
- 批准事件被发送；
- dashboard 可观测性已确认，或其套餐限制被明确记录；
- 事件 payload 无禁止字段。

### SEO

- Viator 书面授权已归档；
- 只有用户批准的 candidate 可索引；
- 其他详情保持 `noindex`；
- sitemap 与 robots 策略一致；
- Search Console 由人工提交。

### 工程

- 既有 TypeScript、Vitest、Playwright、build 和安全测试通过；
- 不写死永久测试数量，以任务开始时的实际基线防回归；
- 没有 DB/schema/env/provider-write 变化；
- 没有 ThaiEleHub/Shopify 变化。

## 13. 仍需用户回答的问题

### Q1 — Viator 内容与索引授权

首批 6 个 SEO candidate 已完成授权边界审查和人工批准。新增 candidate
仍须重复该门禁。

### Q2 — Analytics 可观测性

当前 Vercel 方案能否在 dashboard 查看 custom events？用户暂不升级时，
接受哪些替代观察方式？

### Q3 — Supabase project 事实

RadarScout 与 Thainight 是否同一个 Supabase project？只确认项目归属，
不读取或打印 secret。

### Q4 — Legacy 表面

Bókun、Stripe、crawler 和旧 thainight intelligence 分别 retain、
quarantine 还是 remove？

### Q5 — Phase 1 后续

两周真实数据后再决定 matching、SEO candidate 扩容、Agoda 扩展、
Reality Check、更多城市或多国扩张。

## 14. Future RadarScout MCP API

状态：架构预设计，不属于 Phase 1，不批准运行时代码、部署、env、数据库或
新 provider。

目标：让支持远程 MCP 的 ChatGPT、Claude、Gemini 等客户端查询 RadarScout
已经人工审核的泰国一日游推荐，而不是让通用模型根据训练记忆猜产品、优缺点
或联盟链接。

MCP 是新的分发接口，不是新的事实来源。唯一事实链继续是：

```text
reviewed Viator seed
  → existing fail-closed validator
  → deterministic matching
  → reviewed recommendation signals
  → validated affiliate handoff
  → read-only MCP response
```

### 14.1 协议与部署边界

- 本地开发使用 `stdio`；
- 远程版本使用单一 `/mcp` Streamable HTTP endpoint；
- 远程实现必须校验 `Origin`、限制请求频率，并在需要保护访问时遵循 MCP
  HTTP authorization 规范；
- 工具必须声明严格的 JSON Schema、`outputSchema` 和只读 annotations；
- 返回 `structuredContent`，同时提供简短 text fallback；
- 不使用旧 HTTP+SSE 作为新实现的首选；
- 不为 ChatGPT、Claude、Gemini 分别维护三套业务逻辑；三者共享一个 MCP
  server 和一份契约；
- 如某个消费端暂不支持目标 MCP 能力，只允许做同一 domain service 的薄适配，
  不复制 matching、审核或 handoff 逻辑。

规范依据：

- [MCP transports](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports)
- [MCP tools](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)
- [MCP authorization](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization)

### 14.2 最小工具面

首版只提供三个只读工具，不为 elephant、island hopping、ATV、snorkeling、
temple tour 分别造工具：

1. `search_thailand_experiences`
   - 用于 “best elephant sanctuary”“best snorkeling”等发现请求；
   - 输入目的地、类别、游客类型、pace 和 limit；
   - 返回审核后的确定性排序结果。
2. `get_thailand_experience`
   - 按 RadarScout public product id 读取一个审核产品；
   - id 不存在或未通过公开门禁时返回 not found，不回退到 provider API。
3. `list_thailand_experience_facets`
   - 返回当前真实覆盖的 destinations、categories 和 traveler types；
   - 让客户端先发现能力，避免模型编造不存在的类别或城市。

`search_thailand_experiences` 输入契约：

```ts
type SearchThailandExperiencesInput = {
  query: string
  destination?: string
  categories?: Array<
    | 'elephant'
    | 'island_hopping'
    | 'atv'
    | 'snorkeling'
    | 'temple'
    | 'food'
    | 'culture'
    | 'nature'
    | 'boat'
  >
  travelerType?: 'solo' | 'couple' | 'family' | 'friends'
  pace?: 'easy' | 'balanced' | 'active'
  limit?: number // 1..10
}
```

不要把 “best” 实现成未经证明的绝对销量、评分或价格结论。工具描述和结果应
使用 “top reviewed matches” 或 “reviewed recommendations”，除非未来获得
可合法展示且可审计的排序数据。

### 14.3 输出契约

```ts
type RadarScoutMcpRecommendation = {
  id: string
  title: string
  destination: string
  categories: string[]
  whyRecommended: string
  bestFor: string[]
  pros: string[]
  cons: string[]
  partner: 'viator'
  partnerLink: string
  handoffLabel: 'Check availability'
  reviewedAt: string
  sourceStatus: 'human_reviewed'
}

type SearchThailandExperiencesOutput = {
  query: string
  normalizedIntent: {
    destination: string | null
    categories: string[]
    travelerType: string | null
    pace: string | null
  }
  recommendations: RadarScoutMcpRecommendation[]
  coverage: 'complete' | 'limited' | 'none'
  caveats: string[]
}
```

字段来源必须可追溯：

| MCP field | 允许来源 |
| --- | --- |
| `title`, `destination`, `categories`, `reviewedAt` | validated reviewed Viator seed |
| `whyRecommended`, `bestFor` | existing deterministic recommendation signals |
| `pros` | 只允许从审核 tags、summary 和明确匹配原因生成的确定性、正面事实 |
| `cons` | existing `watchOut` 或未来人工审核的 tradeoff 字段 |
| `partnerLink` | existing Viator affiliate URL validator 通过的 URL |

如果当前审核数据不足以生成具体 `pros`，返回空数组；如果没有具体 tradeoff，
`cons` 只返回现有通用 `watchOut`。不得让调用 MCP 的模型自行补写这些字段。

### 14.4 安全与商业边界

MCP 永远不得输出：

- raw Viator JSON、API key、单独的 affiliate account id 字段或内部审核备注；
- supplier、commission、net rate 或其他商业字段；
- 未获授权的完整 provider description 或图片；
- 未核验价格、评分、评论、库存、实时可用性；
- checkout、payment、booking confirmation；
- 用户 PII 或其他用户的 prompt；
- 未通过审核门禁的产品或 URL。

`partnerLink` 可以包含 Viator 要求的归因参数，但不得把这些参数拆成独立字段，
也不得在日志或其他 metadata 中重复暴露。

每次调用：

- 只读静态 reviewed catalogue，不实时请求 Viator；
- `limit` 最大为 10，拒绝未知字段和自由 SQL/filter 操作符；
- 相同输入与相同 catalogue version 必须得到相同排序；
- URL 再次通过 allowlist/affiliate validator；
- 任一产品校验失败就从结果移除，而不是降级暴露原始记录；
- 日志只记录 tool name、destination/category、result count、latency 和
  catalogue version，不记录原始 query、完整 partner link 或 PII。

MCP 点击本身不等于 affiliate handoff。只有用户实际打开 `partnerLink` 时才算
商业转化意图；未来如需归因，复用 `booking_partner_handoff_clicked` 的安全
事件语义，不新建含完整 URL 的分析 payload。

### 14.5 目录版本与错误语义

每次成功响应应带 server-level metadata：

```ts
type RadarScoutMcpMetadata = {
  schemaVersion: '1.0'
  catalogueVersion: string
  generatedAt: string
  providerCoverage: ['viator']
}
```

- 没有匹配时返回 `recommendations: []`、`coverage: 'none'` 和可用 facets；
- 城市有少量审核产品时返回 `coverage: 'limited'`，不跨城市偷偷补产品；
- 未知 product id 返回稳定的 not-found tool error；
- 内部 validator 或 catalogue load 失败时 fail-closed，返回服务错误，不返回
  部分未校验数据。

### 14.6 分阶段实施

#### MCP-0 — Contract and fixtures

- 只落地 TypeScript schemas、tool descriptions、fixtures 和 contract tests；
- 复用现有 matching/signals/handoff，不写 server transport；
- 证明五个目标查询只返回审核产品和合法 affiliate URL。

#### MCP-1 — Local read-only server

- `stdio` server；
- 三个工具；
- 无 auth、无网络 provider call、无数据库/schema/env 变更；
- 用 MCP Inspector 和本地 Claude/Codex/Gemini client 验证。

#### MCP-2 — Remote private pilot

- `/mcp` Streamable HTTP；
- rate limit、Origin validation、request timeout、structured logs；
- private access / OAuth 方案需单独安全评审；
- 不加入 sitemap，不开放 SEO。

#### MCP-3 — Cross-client certification

- 分别验证 ChatGPT/OpenAI Responses、Claude 和 Gemini 的远程 MCP 调用；
- 同一 fixture 在三个客户端返回同一产品集合和同一 partner link；
- 客户端可以调整自然语言表达，但不得改变结构化事实。

#### MCP-4 — Public distribution decision

只有在 private pilot 有真实使用证据、成本与安全指标可接受后，由用户决定是否
公开 MCP server 或提交到各平台目录。不得自动公开。

### 14.7 MCP-0 验收

- “Best elephant sanctuary”“Best island hopping”“Best ATV”
  “Best snorkeling”“Best temple tour”均有 contract fixture；
- 每个结果都有 `whyRecommended`、`bestFor`、`pros`、`cons` 和
  `partnerLink` 字段；
- 所有结果来自 `loadReviewedViatorProducts()`；
- 所有链接通过 `isReviewedViatorAffiliateUrl()`；
- 结果不包含 forbidden/commercial/raw provider fields；
- 无匹配时明确返回空结果，不让模型猜；
- 相同输入得到确定性排序；
- 未新增数据库表、provider API call、支付、库存或 booking；
- 尚未部署、尚未对外发布。
