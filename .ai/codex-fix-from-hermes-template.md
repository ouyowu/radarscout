请读取下面的 Cherry Hermes 审查报告，只修复 P0 / P1 问题。

重要限制：

- 不要做新功能
- 不要扩大范围
- 不要改数据库
- 不要改 Prisma schema
- 不要执行 migration
- 不要改 server/bokun/*，除非 Hermes P0/P1 明确指出必须改
- 不要改 /api/products 逻辑，除非 Hermes P0/P1 明确指出必须改
- 不要改 /tours 逻辑，除非 Hermes P0/P1 明确指出必须改
- 不要接外部 API
- 不要添加 Viator / GetYourGuide / Klook / affiliate 产品
- 不要添加无法履约的产品
- 不要自动 commit

修复后运行：

pnpm ai:checks
pnpm --filter @reddit-monitor/web exec tsc --noEmit

并验证当前 Phase 相关页面，以及这些基础页面/接口：

- /
- /destinations
- /destinations/thailand
- /world-cup-2026
- /ai-trip-planner
- /tours?tag=Adventure
- /api/products?tag=Adventure&take=2

输出：

1. Fixed issues
2. Files changed
3. What was intentionally not changed
4. TypeScript result
5. Route validation result
6. Remaining P2 items, if any

下面是 Hermes 审查报告：
