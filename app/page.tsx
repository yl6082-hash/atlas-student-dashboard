"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  detail: string;
  due: string;
  duration: string;
  done: boolean;
};

type News = {
  id: number;
  schoolName: string;
  schoolCode: string;
  schoolAccent: string;
  category: string;
  title: string;
  fact: string;
  impact: string;
  action: string;
  level: "high" | "medium" | "low";
  sourceUrl: string;
  sourceLabel: string;
  observedAt: string;
};

type StudentProfile = {
  name: string;
  entryYear: string;
  targetSchool: string;
  intendedMajor: string;
  sat: string;
};

const defaultProfile: StudentProfile = {
  name: "Vincent",
  entryYear: "2027",
  targetSchool: "Cornell",
  intendedMajor: "计算机科学",
  sat: "1510",
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: "完成 Common App 活动列表初稿",
    detail: "先完成最重要的 5 项活动，不追求一次写完",
    due: "今天",
    duration: "35 分钟",
    done: false,
  },
  {
    id: 2,
    title: "确认 10 月 SAT 考位",
    detail: "Cornell 最新标化政策与你相关",
    due: "今天",
    duration: "10 分钟",
    done: false,
  },
  {
    id: 3,
    title: "发送推荐信资料包",
    detail: "向数学老师发送已准备好的素材",
    due: "明天",
    duration: "15 分钟",
    done: false,
  },
];

const navItems = [
  ["⌂", "今日"],
  ["◎", "学校情报"],
  ["◫", "申请计划"],
  ["✦", "AI 顾问"],
];

export default function Home() {
  const [tasks, setTasks] = useState(initialTasks);
  const [profile, setProfile] = useState<StudentProfile>(defaultProfile);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("今日");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [newsItems, setNewsItems] = useState<News[]>([]);
  const [newsStatus, setNewsStatus] = useState<"loading" | "ready" | "unavailable">("loading");

  const completed = tasks.filter((task) => task.done).length;
  const remaining = tasks.length - completed;
  const isCornell = profile.targetSchool === "Cornell";
  const focusTask = isCornell && !profile.sat
    ? { title: "确定首次 SAT 考试时间", description: "Cornell 对你的入学年份要求提交 SAT 或 ACT。先确定一场可执行的首次考试。", reason: "目标学校的标化要求已经明确，先锁定考试时间比继续分散准备更重要。", duration: "15" }
    : { title: "完成 Common App 活动列表初稿", description: "先写最重要的 5 项活动。目标是把“做过什么”变成“产生了什么影响”。", reason: "你的标化已进入目标区间，活动表达是当前回报最高的提升项。", duration: "35" };

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  function toggleTask(id: number) {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    );
  }

  function navigate(label: string) {
    const targets: Record<string, string> = {
      "今日": "today",
      "学校情报": "school-intelligence",
      "申请计划": "upcoming-plan",
    };
    setActiveNav(label);
    setMobileOpen(false);
    if (label === "AI 顾问") {
      setProfileOpen(true);
      return;
    }
    document.getElementById(targets[label])?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function saveProfile() {
    window.localStorage.setItem("atlas-demo-profile", JSON.stringify(profile));
    setProfileOpen(false);
    notify("体验资料已保存，首页已按你的目标更新");
  }

  useEffect(() => {
    fetch("/api/intelligence")
      .then(async (response) => {
        if (!response.ok) throw new Error("feed unavailable");
        return response.json() as Promise<{ items: News[] }>;
      })
      .then(({ items }) => { setNewsItems(items); setNewsStatus("ready"); })
      .catch(() => setNewsStatus("unavailable"));
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem("atlas-demo-profile");
    if (!saved) return;
    try { setProfile({ ...defaultProfile, ...(JSON.parse(saved) as Partial<StudentProfile>) }); } catch { /* Ignore invalid local demo state. */ }
  }, []);

  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand">
          <span className="brand-mark">A</span>
          <span>Atlas</span>
        </div>
        <button className="close-menu" onClick={() => setMobileOpen(false)} aria-label="关闭菜单">×</button>

        <nav>
          {navItems.map(([icon, label]) => (
            <button
              key={label}
              className={activeNav === label ? "nav-item active" : "nav-item"}
              onClick={() => {
                navigate(label);
              }}
            >
              <span>{icon}</span>{label}
              {label === "学校情报" && <em>{newsStatus === "ready" ? newsItems.length : "…"}</em>}
            </button>
          ))}
        </nav>

        <div className="sidebar-summary">
          <span>本周节奏</span>
          <strong>在正确轨道上</strong>
          <div><i style={{ width: "72%" }} /></div>
          <small>完成 5 / 7 项关键任务</small>
        </div>

        <div className="user-row">
          <span className="avatar">{profile.name.slice(0, 1).toUpperCase()}</span>
          <span><strong>{profile.name}</strong><small>{profile.entryYear} 秋季入学</small></span>
          <button onClick={() => setProfileOpen(true)} aria-label="编辑体验资料">···</button>
        </div>
      </aside>

      {mobileOpen && <button className="scrim" onClick={() => setMobileOpen(false)} aria-label="关闭菜单" />}

      <section className="workspace">
        <header className="topbar">
          <button className="menu-button" onClick={() => setMobileOpen(true)} aria-label="打开菜单">☰</button>
          <div className="page-name">今日</div>
          <div className="top-actions">
            <button className="search-button" onClick={() => notify("搜索将在下一阶段开放")}>⌕ <span>搜索</span><kbd>⌘ K</kbd></button>
            <button className="bell" onClick={() => notify("你有 2 条未读提醒")} aria-label="通知">◌<b>2</b></button>
          </div>
        </header>

        <div className="dashboard">
          <section className="welcome" id="today">
            <div>
              <p className="eyebrow">7月28日 · 星期二</p>
              <h1>早上好，{profile.name}</h1>
              <p>今天只需要推进 <strong>{remaining} 件事</strong>。最重要的一步已经为你排好。</p>
            </div>
            <div className="deadline-chip"><span>关注学校：{profile.targetSchool}</span><strong>{profile.entryYear}</strong></div>
          </section>

          <section className="focus-card">
            <div className="focus-copy">
              <div className="focus-label"><span>01</span> 当前任务</div>
              <h2>{focusTask.title}</h2>
              <p>{focusTask.description}</p>
              <div className="focus-reason">
                <span>✦</span>
                <p><strong>为什么现在做</strong>{focusTask.reason}</p>
              </div>
            </div>
            <div className="focus-action">
              <span>预计用时</span>
              <strong>{focusTask.duration}<small>分钟</small></strong>
              <button onClick={() => notify(`专注模式已开始 · ${focusTask.duration}:00`)}>开始任务 <b>→</b></button>
            </div>
          </section>

          <div className="content-grid">
            <section className="tasks-section">
              <div className="section-heading">
                <div><span>接下来</span><h3>任务清单</h3></div>
                <small>{completed}/{tasks.length} 已完成</small>
              </div>

              <div className="task-list">
                {tasks.map((task, index) => (
                  <button
                    className={`task-row ${task.done ? "done" : ""}`}
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                  >
                    <span className={`task-check ${task.done ? "checked" : ""}`}>{task.done ? "✓" : ""}</span>
                    <span className="task-number">0{index + 1}</span>
                    <span className="task-copy"><strong>{task.title}</strong><small>{task.detail}</small></span>
                    <span className="task-meta"><strong>{task.due}</strong><small>{task.duration}</small></span>
                  </button>
                ))}
              </div>

              <div className="task-progress">
                <span>今日完成度</span>
                <div><i style={{ width: `${(completed / tasks.length) * 100}%` }} /></div>
                <strong>{Math.round((completed / tasks.length) * 100)}%</strong>
              </div>
            </section>

            <aside className="briefing" id="upcoming-plan">
              <div className="section-heading">
                <div><span>需要留意</span><h3>近期节点</h3></div>
                <button onClick={() => notify("完整计划将在下一阶段开放")}>查看计划 →</button>
              </div>
              <div className="brief-row">
                <time><strong>16</strong><small>8月</small></time>
                <span><strong>SAT 10 月场报名</strong><small>还剩 19 天</small></span>
                <em>紧急</em>
              </div>
              <div className="brief-row">
                <time><strong>30</strong><small>8月</small></time>
                <span><strong>TOEFL 考试</strong><small>还剩 33 天</small></span>
                <em className="neutral">备考中</em>
              </div>
              <div className="advisor-note">
                <span>✦</span>
                <p><strong>Atlas 提醒</strong>你最近三天都把难任务留到了晚上。今天尽量在 16:00 前完成活动列表。</p>
              </div>
            </aside>
          </div>

          <section className="news-section" id="school-intelligence">
            <div className="section-heading news-heading">
              <div><span>官网重点与最新变化</span><h3>学校新闻与影响判断</h3></div>
              <p>官网重点会直接展示；新的政策变化经核验后，再告诉你影响和下一步。</p>
            </div>

            <div className="news-list">
              {newsItems.map((item) => (
                <article className="news-card" key={item.id}>
                  <div className="news-school">
                    <span className="school-mark" style={{ background: item.schoolAccent }}>{item.schoolCode}</span>
                    <span><strong>{item.schoolName}</strong><small>{item.category} · 已核验</small></span>
                    <em className={item.level}>{item.level === "high" ? "高影响" : item.level === "medium" ? "中影响" : "参考"}</em>
                  </div>
                  <h4>{item.title}</h4>
                  <p className="news-fact">{item.fact}</p>
                  <div className="impact-row">
                    <span className={`impact-icon ${item.level}`}>↳</span>
                    <p><strong>对你的影响</strong>{item.impact}</p>
                  </div>
                  <div className="action-row">
                    <p><span>下一步</span>{item.action}</p>
                    <button onClick={() => setSelectedNews(item)}>查看依据 →</button>
                  </div>
                </article>
              ))}
              {newsStatus === "loading" && <div className="news-empty"><strong>正在读取已核验的学校情报…</strong></div>}
              {newsStatus === "ready" && newsItems.length === 0 && <div className="news-empty"><strong>暂无已核验更新</strong><p>新的官方页面变化会先进入顾问审核，确认后才会显示在这里。</p></div>}
              {newsStatus === "unavailable" && <div className="news-empty"><strong>学校情报服务正在连接</strong><p>请稍后刷新。学生端不会展示未核验的演示内容。</p></div>}
            </div>
          </section>
        </div>
      </section>

      {toast && <div className="toast">✓ {toast}</div>}

      {profileOpen && (
        <div className="modal-backdrop" onClick={() => setProfileOpen(false)}>
          <section className="profile-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setProfileOpen(false)} aria-label="关闭体验设置">×</button>
            <p className="eyebrow">体验设置</p>
            <h2>让 Atlas 先认识你</h2>
            <p className="profile-intro">这些资料只保存在当前设备，用于让体验页的首页提示更贴近你的申请目标。</p>
            <label>你的称呼<input value={profile.name} onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} maxLength={20} /></label>
            <div className="profile-grid">
              <label>目标入学年份<select value={profile.entryYear} onChange={(event) => setProfile((current) => ({ ...current, entryYear: event.target.value }))}><option>2027</option><option>2028</option><option>2029</option></select></label>
              <label>当前 SAT（可留空）<input value={profile.sat} onChange={(event) => setProfile((current) => ({ ...current, sat: event.target.value.replace(/[^0-9]/g, "") }))} placeholder="例如 1510" inputMode="numeric" /></label>
            </div>
            <label>重点关注学校<select value={profile.targetSchool} onChange={(event) => setProfile((current) => ({ ...current, targetSchool: event.target.value }))}><option>Cornell</option><option>UC Davis</option><option>NYU</option><option>CMU</option><option>Stanford</option></select></label>
            <label>意向专业<input value={profile.intendedMajor} onChange={(event) => setProfile((current) => ({ ...current, intendedMajor: event.target.value }))} placeholder="例如 计算机科学" /></label>
            <button className="modal-primary" onClick={saveProfile}>保存并更新首页</button>
          </section>
        </div>
      )}

      {selectedNews && (
        <div className="modal-backdrop" onClick={() => setSelectedNews(null)}>
          <section className="news-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedNews(null)}>×</button>
            <div className="news-school modal-school">
              <span className="school-mark" style={{ background: selectedNews.schoolAccent }}>{selectedNews.schoolCode}</span>
              <span><strong>{selectedNews.schoolName}</strong><small>{selectedNews.category} · 官方来源</small></span>
            </div>
            <p className="eyebrow">影响判断依据</p>
            <h2>{selectedNews.title}</h2>
            <div className="evidence-block"><span>事实</span><p>{selectedNews.fact}</p></div>
            <div className="evidence-block"><span>与你相关</span><p>{selectedNews.impact}</p></div>
            <div className="evidence-block"><span>建议行动</span><p>{selectedNews.action}</p></div>
            <p className="source-note">
              已由顾问核验 · 记录时间：{new Date(selectedNews.observedAt).toLocaleDateString("zh-CN")}
            </p>
            <a className="source-link" href={selectedNews.sourceUrl} target="_blank" rel="noreferrer">
              查看官方来源：{selectedNews.sourceLabel} ↗
            </a>
            <button className="modal-primary" onClick={() => { setSelectedNews(null); notify("已加入你的任务建议"); }}>加入任务建议</button>
          </section>
        </div>
      )}
    </main>
  );
}
