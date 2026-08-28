const metricGroups = {
  overview: {
    title: "交付全景", subtitle: "跨链路核心指标（点击卡片查看定义与明细）",
    metrics: [
      ["需求吞吐量","42","项","↑ 12% 环比","up","planning"],["交付周期 P50","6.2","天","↓ 8% 环比","up","planning"],
      ["代码变更吞吐","186","次","↑ 18% 环比","up","development"],["CI 成功率","94.6","%","↑ 2.1pp 环比","up","quality"],
      ["部署频率","4.8","次/天","↑ 15% 环比","up","release"],["变更失败率","7.1","%","↓ 1.4pp 环比","up","release"],
      ["MTTR","38","分钟","↓ 12% 环比","up","release"],["AI 任务成功率","88.4","%","↑ 4.2pp 环比","up","governance"]
    ]
  },
  planning: {
    title:"需求与规划", subtitle:"需求吞吐、交付周期与 AI 需求产出",
    metrics:[["新建需求","58","项","↑ 9% 环比","up"],["完成需求","42","项","↑ 12% 环比","up"],["取消需求","4","项","↓ 20% 环比","up"],["交付周期 P50","6.2","天","↓ 8% 环比","up"],["交付周期 P95","18.4","天","↑ 3% 环比","warning"],["超期/阻塞需求","9","项","3 个超过目标","warning"],["AI 协助需求占比","64","%","↑ 11pp 环比","up"],["人工接受率","81","%","↑ 5pp 环比","up"]]
  },
  development: {
    title:"开发与协作", subtitle:"提交、PR 健康度与 AI 编码效能",
    metrics:[["提交数","324","次","↑ 16% 环比","up"],["PR 创建/合并","72 / 68","个","合并率 94%","up"],["变更行数","18.6k","行","平均 274 行/PR","up"],["PR 首轮响应","3.8","小时","↓ 14% 环比","up"],["评审轮次","1.7","轮","目标 ≤ 2","up"],["AI 协助 PR","47","%","覆盖率 82%","up"],["建议采纳率","73","%","↑ 6pp 环比","up"],["人工修改率","22","%","↓ 3pp 环比","up"]]
  },
  quality: {
    title:"质量与评测", subtitle:"CI、测试、AI 评测与代码安全",
    metrics:[["CI 成功率","94.6","%","目标 ≥ 95%","warning"],["CI 平均耗时","8.4","分钟","队列等待 1.2 分钟","up"],["测试通过率","97.8","%","单元/集成/E2E","up"],["覆盖率变化","+3.4","pp","当前 84%","up"],["Flaky 测试率","1.8","%","目标 ≤ 2%","up"],["Agent 任务成功率","88.4","%","↑ 4.2pp 环比","up"],["回归失败数","6","次","2 个高优类别","warning"],["高危扫描缺陷","2","个","均已分配","warning"],["漏洞修复时长 P50","2.1","天","↓ 19% 环比","up"]]
  },
  release: {
    title:"发布与可靠性", subtitle:"DORA、发布质量与生产稳定性",
    metrics:[["部署频率","4.8","次/天","↑ 15% 环比","up"],["变更前置时间","1.6","天","↓ 21% 环比","up"],["变更失败率","7.1","%","目标 ≤ 10%","up"],["MTTR","38","分钟","目标 ≤ 60 分钟","up"],["发布成功率","98.1","%","↑ 1.2pp 环比","up"],["回滚率","3.2","%","↓ 0.8pp 环比","up"],["SLO 达成率","99.4","%","目标 ≥ 99%","up"],["生产事故","3","起","影响时长 74 分钟","warning"],["错误率 / P95 延迟","0.18 / 420","% / ms","较上周期稳定","up"]]
  },
  governance: {
    title:"AI 成本与治理", subtitle:"成本、性能、可追溯性与安全策略",
    metrics:[["Token 用量","18.4","M tokens","↑ 8% 环比","warning"],["模型调用次数","12.6k","次","覆盖率 96%","up"],["单任务成本","$0.14","/任务","↓ 6% 环比","up"],["调用延迟 P95","1.8","秒","目标 ≤ 2 秒","up"],["调用失败率","2.4","%","目标 ≤ 3%","up"],["策略拦截率","6.8","%","拦截 412 次","up"],["人工审批覆盖率","91","%","目标 ≥ 90%","up"],["链路可追溯覆盖率","87","%","需求→运行事件","warning"]]
  }
};
const records = [["需求 #1842","需求","验收完成","平台工程"],["PR #739","代码变更","已合并","agenteval"],["CI #9921","CI 任务","失败 · flaky","gateway"],["Eval #421","AI 评测","88 分","智能客服"],["Deploy #208","发布","生产成功","v2.8.0"],["Alert #87","运行事件","已恢复","console"]];
const definitions = "公式、数据来源、刷新频率、时间窗口及维护方见指标定义；聚合延迟数据已标注，未采集数据不计为零值。";
function card([name,value,unit,trend,kind]) {
  const state=kind==="warning"?"预警":"正常";
  return `<article class="card" tabindex="0" data-metric="${name}"><h3>${name} <span class="status ${kind==='warning'?'warn':''}">${state}</span></h3><div class="value">${value}<span class="unit">${unit}</span></div><div class="trend ${kind}">${trend}</div><div class="bar"><i class="${kind==='warning'?'warn':''}" style="width:${Math.min(96,Math.max(22,parseFloat(value)||50))}%"></i></div></article>`;
}
function render(view="overview") {
  const group=metricGroups[view]||metricGroups.overview;
  document.querySelector("#view").innerHTML=`<div class="section-title"><h2>${group.title}</h2><span>${group.subtitle}</span></div><div class="cards">${group.metrics.map(card).join("")}</div><div class="section-title"><h2>可下钻的最新记录</h2><span>点击指标卡查看口径、负责人及源系统</span></div><div class="table-wrap"><table class="records"><thead><tr><th>记录</th><th>类型</th><th>状态/结果</th><th>关联筛选</th></tr></thead><tbody>${records.map(r=>`<tr>${r.map((c,i)=>`<td>${i===2?`<span class="status ${c.includes("失败")?"warn":""}">${c}</span>`:c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  document.querySelectorAll(".card").forEach(el=>el.addEventListener("click",()=>showDetail(el.dataset.metric)));
}
function showDetail(name) {
  document.querySelector("#metric-detail").innerHTML=`<h2>${name}</h2><p>${definitions}</p><dl><dt>业务含义</dt><dd>反映当前筛选条件下 ${name} 的交付表现。</dd><dt>计算口径</dt><dd>按源系统记录聚合，周期类指标使用 P50/P75/P95。</dd><dt>数据来源 / 刷新</dt><dd>需求系统、Git、CI/CD、评测平台与可观测性平台；每 2 分钟刷新。</dd><dt>时间窗口 / 负责人</dt><dd>所选时间范围（默认近 30 天） · AI SDLC 平台组</dd></dl><h3>关联源记录</h3><p>支持下钻至需求、PR/MR、CI、评测、发布和运行事件明细。</p>`;
  document.querySelector("#metric-dialog").showModal();
}
document.querySelectorAll(".tab").forEach(tab=>tab.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));tab.classList.add("active");render(tab.dataset.view)}));
document.querySelector("#metric-dialog .close").addEventListener("click",()=>document.querySelector("#metric-dialog").close());
document.querySelector("#refresh").addEventListener("click",()=>{document.querySelector("#updated").textContent="刚刚";render(document.querySelector(".tab.active").dataset.view)});
["range","team","repo","release"].forEach(id=>document.querySelector(`#${id}`).addEventListener("change",()=>render(document.querySelector(".tab.active").dataset.view)));
render();
