"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Item = {
  id: number; schoolName: string; schoolCode: string; schoolAccent: string; category: string;
  title: string; fact: string; impact: string; action: string; level: string;
  sourceUrl: string; sourceLabel: string; observedAt: string; reviewStatus: string;
};

export default function AdvisorReviewPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<Item | null>(null);
  const [notice, setNotice] = useState("正在连接审核工作台…");
  const [loading, setLoading] = useState(true);

  const pending = useMemo(() => items.filter((item) => item.reviewStatus === "pending_review"), [items]);
  const approved = items.filter((item) => item.reviewStatus === "verified").length;

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/api/advisor/intelligence");
      if (!response.ok) throw new Error(response.status === 401 ? "请先使用顾问账号登录，再访问审核工作台。" : "审核数据暂时不可用。");
      const payload = await response.json() as { items: Item[] };
      setItems(payload.items);
      setSelected(payload.items.find((item) => item.reviewStatus === "pending_review") ?? null);
      setNotice("");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "审核工作台暂时不可用。");
    } finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, []);

  async function review(item: Item, decision: "verified" | "returned") {
    const response = await fetch(`/api/advisor/intelligence/${item.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ decision }),
    });
    if (!response.ok) { setNotice("审核未保存，请稍后重试。"); return; }
    const { item: updated } = await response.json() as { item: Item };
    const nextItems = items.map((current) => current.id === updated.id ? updated : current);
    setItems(nextItems);
    setSelected(nextItems.find((current) => current.reviewStatus === "pending_review") ?? null);
    setNotice(decision === "verified" ? "已核验并发布给学生端。" : "已退回，学生端不会看到这条信息。");
  }

  async function monitor() {
    setNotice("正在检查 5 所学校的官方页面…");
    const response = await fetch("/api/advisor/monitor", { method: "POST" });
    const payload = await response.json() as { initialized?: number; changed?: number; failed?: string[]; error?: string };
    if (!response.ok) { setNotice(payload.error ?? "监测未能启动。"); return; }
    setNotice(`监测完成：新增基线 ${payload.initialized ?? 0} 个，发现变化 ${payload.changed ?? 0} 个。`);
    await load();
  }

  return (
    <main className="advisor-shell">
      <aside className="advisor-sidebar">
        <div className="advisor-brand"><span>A</span> Atlas <small>顾问端</small></div>
        <nav><button>⌂ 概览</button><button className="active">◌ 情报审核 <em>{pending.length}</em></button><button>◫ 学生进度</button><button>▤ 申请计划</button></nav>
        <div className="advisor-side-note"><span>审核原则</span><strong>先证据，后建议</strong><small>学生端只读取已核验的官方情报。</small></div>
      </aside>
      <section className="advisor-workspace">
        <header className="advisor-topbar"><div><span>顾问工作台</span><h1>学校情报审核</h1></div><div className="advisor-actions"><button onClick={() => void monitor()}>检查官方来源</button><Link href="/" className="student-link">查看学生端 ↗</Link></div></header>
        <div className="advisor-content">
          <section className="advisor-summary"><div><span>待审核</span><strong>{pending.length}</strong><small>确认后才会影响学生任务</small></div><div><span>已发布</span><strong>{approved}</strong><small>学生端可见</small></div><div><span>监测学校</span><strong>5</strong><small>Cornell、UC Davis、NYU、CMU、Stanford</small></div></section>
          <div className="review-layout">
            <section className="review-queue"><div className="advisor-section-title"><span>审核队列</span><h2>待确认的学校变化</h2></div>
              {loading ? <div className="empty-state"><strong>正在加载</strong><p>读取审核队列。</p></div> : pending.length === 0 ? <div className="empty-state"><strong>当前没有待审核项目</strong><p>点击“检查官方来源”建立或更新监测基线。</p></div> : pending.map((item) => <button className={`review-queue-item ${selected?.id === item.id ? "selected" : ""}`} key={item.id} onClick={() => setSelected(item)}><span className="review-school-mark" style={{ background: item.schoolAccent }}>{item.schoolCode}</span><span><strong>{item.schoolName}</strong><small>{item.category} · 待核验</small><b>{item.title}</b></span><em>待审核</em></button>)}
            </section>
            <section className="review-detail">
              {selected ? <><div className="detail-header"><div><span className="detail-tag">待审核</span><h2>{selected.title}</h2><p>{selected.schoolName} · {selected.category}</p></div><span className="confidence">状态 <strong>需人工确认</strong></span></div><div className="review-block"><span>检测到的事实</span><p>{selected.fact}</p></div><div className="review-block"><span>面向学生的影响判断</span><p>{selected.impact}</p></div><div className="review-block action"><span>建议下一步</span><p>{selected.action}</p></div><div className="source-list"><span>官方监测来源</span><a href={selected.sourceUrl} target="_blank" rel="noreferrer">{selected.sourceLabel} <b>↗</b></a></div><div className="review-actions"><button className="return" onClick={() => void review(selected, "returned")}>退回补充</button><button className="approve" onClick={() => void review(selected, "verified")}>确认并发布给学生</button></div></> : <div className="empty-state"><strong>审核队列为空</strong><p>{notice || "官方来源的变化将在这里等待确认。"}</p></div>}
            </section>
          </div>
        </div>
      </section>
      {notice && <div className="advisor-toast">{notice}</div>}
    </main>
  );
}
