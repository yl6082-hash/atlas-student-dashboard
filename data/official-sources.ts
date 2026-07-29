export type OfficialSourceConfig = {
  schoolSlug: string;
  schoolName: string;
  schoolCode: string;
  schoolAccent: string;
  label: string;
  url: string;
  kind: "招生政策" | "申请时间线" | "招生要求" | "官方新闻";
};

/** First-party pages only. Third-party rankings and forums are intentionally excluded. */
export const officialSources: OfficialSourceConfig[] = [
  { schoolSlug: "cornell", schoolName: "Cornell University", schoolCode: "CU", schoolAccent: "#b31b1b", label: "Cornell 标化政策", url: "https://admissions.cornell.edu/policies/standardized-testing-policy", kind: "招生政策" },
  { schoolSlug: "cornell", schoolName: "Cornell University", schoolCode: "CU", schoolAccent: "#b31b1b", label: "Cornell First-Year Applicants", url: "https://admissions.cornell.edu/how-to-apply/first-year-applicants", kind: "申请时间线" },
  { schoolSlug: "cornell", schoolName: "Cornell University", schoolCode: "CU", schoolAccent: "#b31b1b", label: "Cornell Chronicle", url: "https://news.cornell.edu/", kind: "官方新闻" },
  { schoolSlug: "uc-davis", schoolName: "UC Davis", schoolCode: "UCD", schoolAccent: "#1f5a99", label: "UC Davis First-year Requirements", url: "https://www.ucdavis.edu/admissions/undergraduate/first-year/requirements", kind: "招生要求" },
  { schoolSlug: "uc-davis", schoolName: "UC Davis", schoolCode: "UCD", schoolAccent: "#1f5a99", label: "UC Davis First-year Timeline", url: "https://www.ucdavis.edu/admissions/undergraduate/first-year", kind: "申请时间线" },
  { schoolSlug: "uc-davis", schoolName: "UC Davis", schoolCode: "UCD", schoolAccent: "#1f5a99", label: "UC Davis News", url: "https://www.ucdavis.edu/news", kind: "官方新闻" },
  { schoolSlug: "nyu", schoolName: "New York University", schoolCode: "NYU", schoolAccent: "#5b2b82", label: "NYU Undergraduate Admissions", url: "https://www.nyu.edu/admissions/undergraduate-admissions.html", kind: "招生要求" },
  { schoolSlug: "nyu", schoolName: "New York University", schoolCode: "NYU", schoolAccent: "#5b2b82", label: "NYU How to Apply", url: "https://www.nyu.edu/admissions/undergraduate-admissions/how-to-apply.html", kind: "申请时间线" },
  { schoolSlug: "nyu", schoolName: "New York University", schoolCode: "NYU", schoolAccent: "#5b2b82", label: "NYU News", url: "https://www.nyu.edu/about/news-publications/news.html", kind: "官方新闻" },
  { schoolSlug: "cmu", schoolName: "Carnegie Mellon University", schoolCode: "CMU", schoolAccent: "#c41230", label: "CMU Undergraduate Requirements", url: "https://www.cmu.edu/admission/admission/undergraduate-admission-requirements", kind: "招生要求" },
  { schoolSlug: "cmu", schoolName: "Carnegie Mellon University", schoolCode: "CMU", schoolAccent: "#c41230", label: "CMU Testing and Deadlines", url: "https://www.cmu.edu/admission/admission/standardized-testing", kind: "招生政策" },
  { schoolSlug: "cmu", schoolName: "Carnegie Mellon University", schoolCode: "CMU", schoolAccent: "#c41230", label: "CMU News", url: "https://www.cmu.edu/news/", kind: "官方新闻" },
  { schoolSlug: "stanford", schoolName: "Stanford University", schoolCode: "SU", schoolAccent: "#8c1515", label: "Stanford First-Year Requirements", url: "https://admission.stanford.edu/apply/first-year/index.html", kind: "申请时间线" },
  { schoolSlug: "stanford", schoolName: "Stanford University", schoolCode: "SU", schoolAccent: "#8c1515", label: "Stanford Standardized Testing", url: "https://admission.stanford.edu/apply/first-year/testing.html", kind: "招生政策" },
  { schoolSlug: "stanford", schoolName: "Stanford University", schoolCode: "SU", schoolAccent: "#8c1515", label: "Stanford Report", url: "https://news.stanford.edu/", kind: "官方新闻" },
];
