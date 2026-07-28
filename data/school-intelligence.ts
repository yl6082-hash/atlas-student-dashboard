export type IntelligenceLevel = "high" | "medium" | "low";

export type SchoolSource = {
  label: string;
  url: string;
  kind: "admissions" | "academics" | "news" | "cds";
};

export type SchoolIntelligenceItem = {
  id: string;
  school: string;
  code: string;
  accent: string;
  category: string;
  publishedAt: string;
  title: string;
  fact: string;
  impact: string;
  action: string;
  level: IntelligenceLevel;
  reviewStatus: "demo" | "pending_review" | "verified";
  sources: SchoolSource[];
};

/**
 * V0.2 的学校情报数据入口。
 * 当前内容用于产品演示；接入采集器后，只替换本文件的数据来源即可，界面不需要重写。
 */
export const schoolIntelligence: SchoolIntelligenceItem[] = [
  {
    id: "cornell-testing-policy",
    school: "Cornell University",
    code: "CU",
    accent: "#b31b1b",
    category: "招生政策",
    publishedAt: "2 小时前",
    title: "2027 入学标化政策更新",
    fact: "申请者需要提交 SAT 或 ACT 成绩，适用于你计划申请的入学年份。",
    impact: "高影响。你尚未确认 10 月考位，这会直接影响申请材料完整性。",
    action: "8 月 16 日前完成报名，并将目标分数设为 1530+。",
    level: "high",
    reviewStatus: "demo",
    sources: [
      { label: "Cornell Undergraduate Admissions", url: "https://admissions.cornell.edu/", kind: "admissions" },
    ],
  },
  {
    id: "ucd-data-science",
    school: "UC Davis",
    code: "UCD",
    accent: "#1f5a99",
    category: "课程变化",
    publishedAt: "昨天",
    title: "新增数据科学跨学科课程说明",
    fact: "学校在课程页面补充了数据科学与公共议题相关的跨学科路径说明。",
    impact: "中影响。它更适合用来判断你对公立研究型大学与跨学科课程的匹配度。",
    action: "加入选校笔记，后续将课程、专业容量和转专业政策一起核查。",
    level: "medium",
    reviewStatus: "demo",
    sources: [
      { label: "UC Davis Undergraduate Admissions", url: "https://www.ucdavis.edu/admissions/undergraduate", kind: "admissions" },
      { label: "UC Davis Catalog", url: "https://catalog.ucdavis.edu/", kind: "academics" },
    ],
  },
  {
    id: "nyu-application-materials",
    school: "New York University",
    code: "NYU",
    accent: "#5b2b82",
    category: "申请材料",
    publishedAt: "3 天前",
    title: "本科申请材料说明更新",
    fact: "学校发布了下一申请周期的材料说明与申请路径提示。",
    impact: "中影响。你需要尽早确认目标学院与专业，避免后续材料准备方向分散。",
    action: "在 8 月内确定 NYU 的目标学院，并将对应材料节点加入申请计划。",
    level: "medium",
    reviewStatus: "demo",
    sources: [
      { label: "NYU Admissions", url: "https://www.nyu.edu/admissions.html", kind: "admissions" },
    ],
  },
  {
    id: "cmu-application",
    school: "Carnegie Mellon University",
    code: "CMU",
    accent: "#c41230",
    category: "申请要求",
    publishedAt: "待采集",
    title: "本科申请要求监测已建立",
    fact: "将持续监测招生页面、学院说明与补充材料要求的变化。",
    impact: "作为你的冲刺校，任何材料或截止日期变化都应优先提醒。",
    action: "确认目标学院，并将本科招生页面纳入每周核查。",
    level: "medium",
    reviewStatus: "pending_review",
    sources: [
      { label: "CMU Undergraduate Admission", url: "https://www.cmu.edu/admission/", kind: "admissions" },
    ],
  },
  {
    id: "stanford-admission",
    school: "Stanford University",
    code: "SU",
    accent: "#8c1515",
    category: "招生情报",
    publishedAt: "待采集",
    title: "本科招生与学术新闻监测已建立",
    fact: "将持续追踪招生页面、研究新闻与目标专业的课程更新。",
    impact: "用于判断你与学校研究方向的连接点，不作为录取预测依据。",
    action: "在活动列表中标记可与目标专业形成联系的项目。",
    level: "low",
    reviewStatus: "pending_review",
    sources: [
      { label: "Stanford Undergraduate Admission", url: "https://admission.stanford.edu/", kind: "admissions" },
      { label: "Stanford News", url: "https://news.stanford.edu/", kind: "news" },
    ],
  },
];

export const trackedSchools = Array.from(new Set(schoolIntelligence.map((item) => item.school)));
