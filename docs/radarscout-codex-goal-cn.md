# RadarScout — Codex 长期目标契约

> 本文件定义“为什么做”和“什么时候停”。具体页面规格以
> `docs/page-spec.md`、`docs/content-model.md`、`docs/component-map.md`
> 和 `docs/radarscout-frontend-design.md` 为准；具体任务以
> `docs/radarscout-codex-task-queue.md` 为准。代码事实与文档冲突时，
> 先更新文档，禁止平行重建第二套实现。

## 1. 产品目标

RadarScout 帮助英文自由行游客规划泰国城市的一日游组合：

1. 用自然语言或引导式选项表达城市、天数和兴趣；
2. 由确定性逻辑形成结构化 TripSpec 和行程槽位；
3. 匹配人工审核的泰国体验产品；
4. 让用户在 RadarScout 比较，再通过 `Check availability` 前往外部平台完成后续动作。

RadarScout 当前不拥有支付、结账、库存、实时可用性或预订确认。

## 2. 北极星

> 每月由真实用户产生的 `booking_partner_handoff_clicked` 次数。

截至 2026-07-17 的仓库事实：

- 事件已经在代码中定义并接入 Vercel Web Analytics；
- Planner、finder 和产品详情 CTA 已触发该事件；
- 当前 dashboard 中可观察到的真实事件数量尚未完成确认，因此状态是
  **unknown / not yet verified**，不能写成确定的 0；
- 71 条人工审核 Viator seed 已存在；
- `tourDetailSeoCandidates` 仍为空，因此产品详情页没有自然搜索获取面。

不要用 PR 数量、文档数量、代码行数或页面数量代替北极星。

## 3. 当前阶段：Phase 1 — 证明流量与点击

Phase 1 只完成以下闭环：

1. 确认当前生产部署与仓库安全基线一致；
2. 用普通浏览器验证首页 → Planner → 产品 → `Check availability`；
3. 确认 pageview 与批准的 funnel events 可在当前 Vercel 方案中观察；
4. 获得 Viator 对公开展示、图片、缓存、署名、深链接和索引的书面说明；
5. 由用户逐个批准一小批 SEO candidate；
6. 通过人工门禁开放这些 candidate，其他产品继续 `noindex`；
7. 提交 sitemap/Search Console 后观察至少两周真实流量。

Phase 1 不新增：

- POI、TravelModule、RealityRule 等数据库表；
- 登录、保存行程、PDF、多语言或 CMS；
- 酒店、机票或站内支付；
- LLM 检索或事实生成；
- 地图、地理编码或未经审核的坐标；
- 第二个 analytics provider。

## 4. 已有资产：只复用，不重建

- 71 条 reviewed Viator seed 与 fail-closed 校验器；
- Viator-only 产品匹配与 affiliate handoff；
- `track()` shim、Vercel Analytics 和批准的事件 taxonomy；
- `tourDetailSeoCandidates`、`getTourDetailRobots` 与 sitemap 闸门；
- prompt-first 首页、Planner、listing、产品详情与响应式设计系统；
- 页面、组件、内容模型与验收规格；
- 既有安全、SEO、copy 和 E2E 测试。

不另建点击追踪、不另建 SEO 闸门、不另写一套页面结构。

## 5. 当前真正的关键路径

```text
确认生产与 analytics 可观测性
  → Viator Q1 书面授权
  → 用户批准首批 candidate id
  → TD-RADARSCOUT-SEO-CANDIDATE-UNLOCK-2B
  → 人工 merge / production deploy
  → Search Console + 两周真实观察
```

如果 analytics 在当前 Vercel 方案中只能发送而无法查看 custom events，
记录为运营限制；不要自动升级套餐，也不要引入第二个 vendor。

## 6. 人工硬闸门

遇到以下情况必须停止相关任务并报告，不得绕过：

1. Viator 内容/图片/索引授权没有书面确认；
2. 没有用户逐个提供的 SEO candidate id 和审核记录；
3. SEO index/follow、robots 或 sitemap 对外策略变更；
4. 生产部署、生产数据库、schema、migration 或 env 变更；
5. 新增第三方 provider、SDK、支付或 booking 能力；
6. 重新启用 Bókun 产品发布、同步或 widget handoff；
7. 删除路由、数据或用户文件；
8. 规格与当前代码事实不一致。

Viator Full Access 申请通过与否，不自动等于获得 Viator unique content
的 SEO 索引权。

## 7. 产品不变量

1. 检索与产品匹配不依赖 LLM；事实来自审核数据和确定性规则。
2. 请求 N 天时，行程数据结构必须有 N 个明确槽位；缺少产品时显示
   planning-only/empty slot，不伪造产品或地点。
3. 没有人工审核坐标时不渲染地图；禁止地理编码和 `(0,0)` 回落。
4. CTA 固定为 `Check availability`，直接前往审核后的 affiliate URL。
5. 外链使用 `nofollow sponsored noopener noreferrer`。
6. 不伪造价格、库存、可订状态、评分、评论、营业时间或安全保证。
7. 不把 PII、原始 prompt、完整 partner URL、价格或 booking 状态发给 analytics。
8. 未获批准的产品详情页保持 `noindex` 且不进入 sitemap。
9. 既有测试不得回归；使用任务开始时的实际基线，不写死永久测试数量。
10. 新增表面积前先证明已有路径不能满足目标。

## 8. Supabase 与 Prisma

当前架构约定是 PostgreSQL + Prisma ORM。连接字符串特征和旧文档提示
生产数据库可能托管于 Supabase，但这不是已验证的运行事实。

如未来融合 Thainight：

- 先由用户确认两个项目是否使用同一个 Supabase project；
- 应用访问层默认统一为 Prisma；
- 不允许同时维护两套数据访问逻辑；
- 任何 schema、迁移或真实数据搬迁都是单独人工审批任务。

## 9. 每次会话协议

开始时先回答：

1. 北极星当前是已测量、未知还是不可观察？
2. 当前生产与仓库基线是否一致？
3. 本次只做哪一件事？
4. 它如何推进北极星，如何验收？
5. 是否撞到人工硬闸门？

结束时只更新已有状态入口，不新建重复状态文档。报告变更文件、验证、
剩余 blocker 和下一步。一次只做一个可验证的垂直闭环。

## 10. 阶段门

进入 Phase 1.5 或更晚阶段前，必须满足：

- Phase 1 已上线；
- 至少两周真实流量可观察；
- `booking_partner_handoff_clicked` 有真实结果；
- 用户依据数据明确批准下一阶段。

点击为 0 时优先检查流量、入口、选品、页面理解和归因，不先建大型后台。

## 11. 结束条件

当首批合规 SEO 页面上线、Search Console 已提交、点击可以被观察并积累
两周数据时，Phase 1 结束。此时停止自动扩建，由用户根据真实数据决定：

- 扩更多泰国城市/产品；
- 优化 matching；
- 引入 Agoda 住宿入口；
- 开始 Reality Check；
- 或重新审视产品假设。
