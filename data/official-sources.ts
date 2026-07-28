export type OfficialSourceConfig = {
  schoolSlug: string;
  schoolName: string;
  schoolCode: string;
  schoolAccent: string;
  label: string;
  url: string;
  kind: "招生政策" | "申请时间线" | "招生要求";
};

/** First-party pages only. Third-party rankings and forums are intentionally excluded. */
export const officialSources: OfficialSourceConfig[] = [
  { schoolSlug: "cornell", schoolName: "Cornell University", schoolCode: "CU", schoolAccent: "#b31b1b", label: "Cornell 标化政策", url: "https://admissions.cornell.edu/policies/standardized-testing-policy", kind: "招生政策" },
  { schoolSlug: "uc-davis", schoolName: "UC Davis", schoolCode: "UCD", schoolAccent: "#1f5a99", label: "UC Davis First-year Requirements", url: "https://www.ucdavis.edu/admissions/undergraduate/first-year/requirements", kind: "招生要求" },
  { schoolSlug: "nyu", schoolName: "New York University", schoolCode: "NYU", schoolAccent: "#5b2b82", label: "NYU Undergraduate Admissions", url: "https://www.nyu.edu/admissions/undergraduate-admissions.html", kind: "招生要求" },
  { schoolSlug: "cmu", schoolName: "Carnegie Mellon University", schoolCode: "CMU", schoolAccent: "#c41230", label: "CMU Undergraduate Admission", url: "https://www.cmu.edu/admission/", kind: "招生要求" },
  { schoolSlug: "stanford", schoolName: "Stanford University", schoolCode: "SU", schoolAccent: "#8c1515", label: "Stanford First-Year Application", url: "https://admission.stanford.edu/apply/first-year/", kind: "招生要求" },
];
