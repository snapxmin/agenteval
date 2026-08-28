# agenteval

## AI SDLC 看板

这是一个无需构建步骤即可访问的 AI SDLC 全链路看板原型。用浏览器打开
`index.html` 即可查看总览、需求与规划、开发与协作、质量与评测、发布与可靠性、
AI 成本与治理六个视图。

看板提供统一的时间范围、团队/项目、仓库和发布版本筛选，指标卡可点击查看指标
定义、口径、来源、刷新频率、时间窗口和维护方；下方明细支持下钻到需求、PR、
CI、评测、发布和运行事件。示例数据明确展示刷新延迟和采集覆盖率，缺失数据应
显示为“暂无数据”而非零值。

### 指标口径与接入

| 数据域 | 来源 | 刷新频率 | 关键指标 |
| --- | --- | --- | --- |
| 需求规划 | 需求系统 | 2 分钟 | 吞吐量、P50/P75/P95 周期、阻塞、AI 接受率 |
| 开发协作 | Git/PR | 2 分钟 | 提交、变更行数、评审响应、采纳率 |
| 质量评测 | CI、测试、扫描、评测平台 | 2 分钟 | 成功率、覆盖率、Flaky、Agent 成功率、缺陷 |
| 发布运行 | CD、可观测性平台 | 2 分钟 | 部署频率、前置时间、失败率、MTTR、SLO |
| AI 成本治理 | 模型网关、策略审计 | 2 分钟 | Token、成本、延迟、失败率、拦截率、可追溯率 |

周期指标按自然日计算并展示 P50/P75/P95；比率为符合筛选条件的分子除以分母。
默认时间窗口为近 30 天，目标阈值在指标卡趋势文字中展示，异常指标以黄色标识。

## 由 plan.md 自动触发 Copilot 编码代理

`.github/workflows/copilot-plan-to-pr.yml` 在 `main` 分支的 `plan.md` 发生变更
时自动运行：它会读取 `plan.md` 内容创建一个 Issue，并通过 GraphQL API 将其分配
给 GitHub Copilot 编码代理（coding agent），由 Copilot 基于该计划自动实现并最
终生成对应的 Pull Request。也可以在 Actions 页面手动触发（`workflow_dispatch`）。

### Issue 驱动的计划 PR

`.github/workflows/issue-copilot-plan.yml` 监听新建且仍处于打开状态的普通 Issue。
它会从默认分支创建 `copilot/issue-<编号>-<标题>` 临时分支，在根目录生成结构化
`plan.md`，并创建指向默认分支的 Draft PR。计划 PR 只包含计划，不直接修改业务代码；
Issue 会收到分支和 PR 链接。工作流会先按分支查找已有 PR，因此重复投递不会重复创建。

启用前请确认 Actions 允许使用 `GITHUB_TOKEN` 写入 Contents、Issues 和 Pull requests，
并在仓库设置中允许 GitHub Copilot coding agent 使用该仓库。工作流将 Issue 标题、
描述、编号和链接写入计划中的 Copilot 上下文，供人工审阅后交给 Copilot 实施。
可通过创建测试 Issue、在 Actions 页面查看运行记录，或使用 `act`（提供等价的
`github` 事件和写权限）进行手动验证。失败时工作流会在 Issue 中评论失败阶段及
对应 Actions 日志入口。

使用前需要满足：

1. 仓库已启用 Copilot 编码代理（Coding agent）。
2. 在仓库 Settings → Secrets and variables → Actions 中添加名为 `COPILOT_PAT`
   的 Secret，值为一个具备以下权限的个人访问令牌（因为分配 Issue 给 Copilot
   需要 user-to-server 令牌，默认的 `GITHUB_TOKEN` 不满足要求）：
   - 细粒度 PAT：对 Actions、Contents、Issues、Pull requests 具有读写权限，
     对 Metadata 具有只读权限；
   - 或经典 PAT：具备 `repo` 权限范围。

工作流会创建标题为“Implement plan from plan.md”的 Issue，正文为 `plan.md` 的
全部内容，并将其分配给 Copilot（`copilot-swe-agent`），触发编码代理在后台完成
实现并打开 PR。
