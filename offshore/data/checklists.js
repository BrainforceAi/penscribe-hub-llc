/* Document checklists by role. Priority: E = essential, R = required by most employers, A = if required / role dependent, N = renewal when due.
   General guidance only: always confirm with the employer and the country concerned. */
(function () {
  const PRIORITY = { E: "Essential", R: "Required by employer", A: "If required", N: "Renew when due" };
  const personal = { name: "Personal and employment documents", icon: "🪪", items: [
    ["International passport (6–12 months' validity)", "E"], ["Updated professional CV (offshore format)", "E"], ["Passport-size photographs", "R"],
    ["Educational certificates", "R"], ["Professional training certificates", "R"], ["Employment reference letters", "R"],
    ["Previous offshore work experience records", "R"], ["Seaman's book / discharge book", "A"], ["Valid work permit or visa", "A"]] };
  const medical = (extra = []) => ({ name: "Medical and regulatory documents", icon: "🩺", items: [
    ["Valid offshore medical fitness certificate", "E"], ["Drug and alcohol test report", "A"], ["Vision and hearing test report", "A"], ["Vaccination records", "A"], ...extra] });
  const ops = { name: "Operational and onboarding documents", icon: "📋", items: [
    ["Previous rig or vessel experience letter", "R"], ["Offshore service record", "R"], ["Competency assessment records", "A"], ["Training matrix", "A"],
    ["Next of kin information", "R"], ["Emergency contact details", "R"], ["Signed employment or mobilisation documents (after offer)", "R"]] };
  const base = ["BOSIET (or T-BOSIET)", "E"], foet = ["FOET (when BOSIET renewal is due)", "N"], huet = ["HUET (where required, or included in your BOSIET)", "A"];

  window.DOC_PRIORITY = PRIORITY;
  window.DOC_ROLES = [
    { id: "driller", name: "Driller & drilling crew", cat: "drilling", categories: [
      personal,
      { name: "Offshore safety certifications", icon: "🦺", items: [base, foet, huet, ["H2S awareness / H2S training", "A"], ["Firefighting and fire prevention training", "R"], ["First aid certification", "R"], ["Working at heights training", "A"], ["Confined space entry training", "A"]] },
      medical(),
      { name: "Drilling-specific certifications", icon: "🛠️", items: [["IWCF well control certificate", "A"], ["IADC WellSharp certificate", "A"], ["Drilling operations training certificate", "R"], ["Well control and blowout prevention training", "R"], ["Drilling equipment operations training", "R"], ["Rig floor safety training", "R"], ["Permit to Work (PTW) training", "R"], ["Lockout / Tagout (LOTO) training", "R"]],
        note: "IWCF and IADC well control certificates show you can manage well control situations, so they carry great weight with drilling employers." },
      ops] },
    { id: "marine", name: "Marine & vessel crew", cat: "marine", categories: [
      personal,
      { name: "Safety and seafarer certificates", icon: "🦺", items: [["STCW Basic Safety Training", "E"], base, foet, ["Proficiency in survival craft (where required)", "A"], ["Advanced firefighting (officers, where required)", "A"], ["First aid / medical care certificate", "R"]] },
      medical([["Seafarer medical (ENG1 or equivalent)", "E"]]),
      { name: "Role-specific certifications", icon: "⚓", items: [["Certificate of Competency (officers) or rating certificate (ABs)", "E"], ["DP certificate (Nautical Institute) for DP operators", "A"], ["GMDSS certificate (where applicable)", "A"], ["Flag-state endorsements", "A"], ["Sea service records", "R"]] },
      ops] },
    { id: "subsea", name: "Subsea, ROV & diving", cat: "subsea", categories: [
      personal,
      { name: "Offshore safety certifications", icon: "🦺", items: [base, foet, huet, ["First aid certification", "R"], ["Working at heights training", "A"], ["H2S awareness", "A"]] },
      medical([["Diving medical (divers only)", "A"]]),
      { name: "Role-specific certifications", icon: "🤿", items: [["ROV pilot / technician training certificates", "E"], ["Logbook of ROV or diving hours", "R"], ["Commercial diver qualification (divers only)", "A"], ["Electrical, electronic or hydraulic qualifications", "R"], ["Equipment-specific training records", "R"]] },
      ops] },
    { id: "technician", name: "Technician, engineer & trades", cat: "maintenance", categories: [
      personal,
      { name: "Offshore safety certifications", icon: "🦺", items: [base, foet, huet, ["H2S awareness", "A"], ["First aid certification", "R"], ["Working at heights training", "R"], ["Confined space entry training", "A"], ["Manual handling training", "R"]] },
      medical(),
      { name: "Trade and professional certifications", icon: "🔧", items: [["Trade or engineering qualification certificate", "E"], ["Welding qualification (for welders, for example 6G)", "A"], ["Rigging, banksman and slinger certificates", "A"], ["Electrical competence and hazardous-area training", "A"], ["Permit to Work (PTW) training", "R"], ["Lockout / Tagout (LOTO) training", "R"]] },
      ops] },
    { id: "support", name: "Catering, support & entry level", cat: "entry", categories: [
      personal,
      { name: "Safety certificates", icon: "🦺", items: [base, foet, ["First aid certification", "R"], ["Basic firefighting training", "R"]] },
      medical(),
      { name: "Role-specific documents", icon: "🍽️", items: [["Food hygiene certificate (catering roles)", "R"], ["Police clearance certificate (where required)", "A"], ["Reference from previous employer or trainer", "R"], ["Basic English or other language proof (if asked)", "A"]] },
      ops] }
  ];
})();
