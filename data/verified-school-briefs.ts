/**
 * Human-verified baseline summaries from first-party university pages.
 *
 * These are intentionally separate from change events: a first monitor run
 * establishes a baseline and therefore cannot truthfully call the whole page
 * "new". Future detected changes still go through the advisor review queue.
 */
export const verifiedSchoolBriefs = [
  {
    id: -3,
    schoolSlug: "nyu",
    schoolName: "New York University",
    schoolCode: "NYU",
    schoolAccent: "#5b2b82",
    category: "官网要点",
    title: "NYU 申请时需要先确定主校园与目标学院",
    fact: "NYU 的 Common Application 可覆盖纽约、阿布扎比和上海三个学位授予校园。申请者需要选择主校园，也可以列出备选校园；具体学院或专业还可能有附加材料要求。",
    impact: "校园、学院和专业选择会直接改变材料清单。若方向尚未确定，过早写 NYU 补充材料容易出现内容与申请项目不匹配。",
    action: "先确认目标校园、学院和第一意向专业，再建立对应的材料清单；艺术类项目需另外核查作品集或试镜要求。",
    level: "medium" as const,
    sourceUrl: "https://nyuad.nyu.edu/en/home/apply/undergraduate/apply.html",
    sourceLabel: "NYU Abu Dhabi｜Apply for Admission",
    observedAt: "2026-07-29T00:00:00.000Z",
  },
  {
    id: -2,
    schoolSlug: "cmu",
    schoolName: "Carnegie Mellon University",
    schoolCode: "CMU",
    schoolAccent: "#c41230",
    category: "官网要点",
    title: "CMU 标化政策按申请学院区分",
    fact: "CMU 官方说明：School of Computer Science 要求 SAT 或 ACT；工程、Dietrich、信息系统、科学与 Tepper 采用 test-flexible；College of Fine Arts 为 test-optional，并继续要求作品集或试镜。",
    impact: "如果你申请计算机科学，SAT/ACT 是必交材料；如果申请其他学院，不能直接套用 SCS 的要求，需按学院确认可接受的考试类型。",
    action: "先确定 CMU 申请学院。目标为 SCS 时立即把 SAT/ACT 纳入主时间线；其他学院则核对 AP、IB、A-Level 等可接受选项。",
    level: "high" as const,
    sourceUrl: "https://www.cmu.edu/admission/admission/standardized-testing",
    sourceLabel: "CMU Undergraduate Admission｜Standardized Testing",
    observedAt: "2026-07-29T00:00:00.000Z",
  },
  {
    id: -1,
    schoolSlug: "stanford",
    schoolName: "Stanford University",
    schoolCode: "SU",
    schoolAccent: "#8c1515",
    category: "官网要点",
    title: "Stanford 首年申请要求提交 SAT 或 ACT",
    fact: "Stanford 官方首年申请页面将 ACT 或 SAT 列为必交材料。学校允许申请时自报成绩；REA 的标准申请截止日为 11 月 1 日，RD 为 1 月 5 日。",
    impact: "标化不能作为可选项搁置。若 Stanford 在目标名单中，考试时间必须与 REA 或 RD 节点一起倒排。",
    action: "确定申请轮次并检查考试安排：REA 尽量在 10 月底前完成 SAT，RD 则需在 12 月底前完成可用成绩。",
    level: "high" as const,
    sourceUrl: "https://admission.stanford.edu/apply/first-year/testing.html",
    sourceLabel: "Stanford Admission｜Standardized Testing",
    observedAt: "2026-07-29T00:00:00.000Z",
  },
];
