import { C as __toESM, t as require_jsx_runtime, y as require_react } from "../index.js";
//#region app/page.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var initialTasks = [
	{
		id: 1,
		title: "完成 Common App 活动列表初稿",
		detail: "先完成最重要的 5 项活动，不追求一次写完",
		due: "今天",
		duration: "35 分钟",
		done: false
	},
	{
		id: 2,
		title: "确认 10 月 SAT 考位",
		detail: "Cornell 最新标化政策与你相关",
		due: "今天",
		duration: "10 分钟",
		done: false
	},
	{
		id: 3,
		title: "发送推荐信资料包",
		detail: "向数学老师发送已准备好的素材",
		due: "明天",
		duration: "15 分钟",
		done: false
	}
];
var navItems = [
	["⌂", "今日"],
	["◎", "学校情报"],
	["◫", "申请计划"],
	["✦", "AI 顾问"]
];
function Home() {
	const [tasks, setTasks] = (0, import_react.useState)(initialTasks);
	const [activeNav, setActiveNav] = (0, import_react.useState)("今日");
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const [toast, setToast] = (0, import_react.useState)("");
	const [selectedNews, setSelectedNews] = (0, import_react.useState)(null);
	const [newsItems, setNewsItems] = (0, import_react.useState)([]);
	const [newsStatus, setNewsStatus] = (0, import_react.useState)("loading");
	const completed = tasks.filter((task) => task.done).length;
	const remaining = tasks.length - completed;
	function notify(message) {
		setToast(message);
		window.setTimeout(() => setToast(""), 2200);
	}
	function toggleTask(id) {
		setTasks((current) => current.map((task) => task.id === id ? {
			...task,
			done: !task.done
		} : task));
	}
	(0, import_react.useEffect)(() => {
		fetch("/api/intelligence").then(async (response) => {
			if (!response.ok) throw new Error("feed unavailable");
			return response.json();
		}).then(({ items }) => {
			setNewsItems(items);
			setNewsStatus("ready");
		}).catch(() => setNewsStatus("unavailable"));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "app-shell",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: `sidebar ${mobileOpen ? "open" : ""}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "brand",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "brand-mark",
							children: "A"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Atlas" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "close-menu",
						onClick: () => setMobileOpen(false),
						"aria-label": "关闭菜单",
						children: "×"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", { children: navItems.map(([icon, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: activeNav === label ? "nav-item active" : "nav-item",
						onClick: () => {
							setActiveNav(label);
							setMobileOpen(false);
							if (label !== "今日") notify(`${label}将在下一阶段开放`);
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: icon }),
							label,
							label === "学校情报" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "3" })
						]
					}, label)) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sidebar-summary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "本周节奏" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "在正确轨道上" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { width: "72%" } }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "完成 5 / 7 项关键任务" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "user-row",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "avatar",
								children: "V"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Vincent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "2027 秋季入学" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => notify("个人档案将在下一阶段开放"),
								children: "···"
							})
						]
					})
				]
			}),
			mobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "scrim",
				onClick: () => setMobileOpen(false),
				"aria-label": "关闭菜单"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "workspace",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "topbar",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "menu-button",
							onClick: () => setMobileOpen(true),
							"aria-label": "打开菜单",
							children: "☰"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "page-name",
							children: "今日"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "top-actions",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "search-button",
								onClick: () => notify("搜索将在下一阶段开放"),
								children: [
									"⌕ ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "搜索" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", { children: "⌘ K" })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "bell",
								onClick: () => notify("你有 2 条未读提醒"),
								"aria-label": "通知",
								children: ["◌", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "2" })]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "dashboard",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "welcome",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "eyebrow",
									children: "7月28日 · 星期二"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "早上好，Vincent" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									"今天只需要推进 ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [remaining, " 件事"] }),
									"。最重要的一步已经为你排好。"
								] })
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "deadline-chip",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "距离 Cornell ED" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "95 天" })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "focus-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "focus-copy",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "focus-label",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "01" }), " 当前任务"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "完成 Common App 活动列表初稿" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "先写最重要的 5 项活动。目标是把“做过什么”变成“产生了什么影响”。" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "focus-reason",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✦" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "为什么现在做" }), "你的标化已进入目标区间，活动表达是当前回报最高的提升项。"] })]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "focus-action",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "预计用时" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["35", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "分钟" })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => notify("专注模式已开始 · 35:00"),
										children: ["开始任务 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "→" })]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "content-grid",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "tasks-section",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "section-heading",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "接下来" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "任务清单" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
											completed,
											"/",
											tasks.length,
											" 已完成"
										] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "task-list",
										children: tasks.map((task, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: `task-row ${task.done ? "done" : ""}`,
											onClick: () => toggleTask(task.id),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `task-check ${task.done ? "checked" : ""}`,
													children: task.done ? "✓" : ""
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "task-number",
													children: ["0", index + 1]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "task-copy",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: task.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: task.detail })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "task-meta",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: task.due }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: task.duration })]
												})
											]
										}, task.id))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "task-progress",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "今日完成度" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { width: `${completed / tasks.length * 100}%` } }) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [Math.round(completed / tasks.length * 100), "%"] })
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
								className: "briefing",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "section-heading",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "需要留意" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "近期节点" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => notify("完整计划将在下一阶段开放"),
											children: "查看计划 →"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "brief-row",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("time", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "16" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "8月" })] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "SAT 10 月场报名" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "还剩 19 天" })] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "紧急" })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "brief-row",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("time", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "30" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "8月" })] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "TOEFL 考试" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "还剩 33 天" })] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
												className: "neutral",
												children: "备考中"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "advisor-note",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✦" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Atlas 提醒" }), "你最近三天都把难任务留到了晚上。今天尽量在 16:00 前完成活动列表。"] })]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "news-section",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "section-heading news-heading",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "与你相关的变化" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "学校新闻与影响判断" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "不是新闻聚合，而是告诉你：发生了什么、与你有什么关系、下一步做什么。" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "news-list",
								children: [
									newsItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
										className: "news-card",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "news-school",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "school-mark",
														style: { background: item.schoolAccent },
														children: item.schoolCode
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.schoolName }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [item.category, " · 已核验"] })] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
														className: item.level,
														children: item.level === "high" ? "高影响" : item.level === "medium" ? "中影响" : "参考"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: item.title }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "news-fact",
												children: item.fact
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "impact-row",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `impact-icon ${item.level}`,
													children: "↳"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "对你的影响" }), item.impact] })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "action-row",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "下一步" }), item.action] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => setSelectedNews(item),
													children: "查看依据 →"
												})]
											})
										]
									}, item.id)),
									newsStatus === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "news-empty",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "正在读取已核验的学校情报…" })
									}),
									newsStatus === "ready" && newsItems.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "news-empty",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "暂无已核验更新" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "新的官方页面变化会先进入顾问审核，确认后才会显示在这里。" })]
									}),
									newsStatus === "unavailable" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "news-empty",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "学校情报服务正在连接" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "请稍后刷新。学生端不会展示未核验的演示内容。" })]
									})
								]
							})]
						})
					]
				})]
			}),
			toast && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "toast",
				children: ["✓ ", toast]
			}),
			selectedNews && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal-backdrop",
				onClick: () => setSelectedNews(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "news-modal",
					onClick: (event) => event.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "modal-close",
							onClick: () => setSelectedNews(null),
							children: "×"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "news-school modal-school",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "school-mark",
								style: { background: selectedNews.schoolAccent },
								children: selectedNews.schoolCode
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: selectedNews.schoolName }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [selectedNews.category, " · 官方来源"] })] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: "影响判断依据"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: selectedNews.title }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "evidence-block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "事实" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: selectedNews.fact })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "evidence-block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "与你相关" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: selectedNews.impact })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "evidence-block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "建议行动" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: selectedNews.action })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "source-note",
							children: ["已由顾问核验 · 记录时间：", new Date(selectedNews.observedAt).toLocaleDateString("zh-CN")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							className: "source-link",
							href: selectedNews.sourceUrl,
							target: "_blank",
							rel: "noreferrer",
							children: [
								"查看官方来源：",
								selectedNews.sourceLabel,
								" ↗"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "modal-primary",
							onClick: () => {
								setSelectedNews(null);
								notify("已加入你的任务建议");
							},
							children: "加入任务建议"
						})
					]
				})
			})
		]
	});
}
//#endregion
export { Home as default };
