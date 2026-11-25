/* Drives the guided document flow. Edit freely; names must match data/checklists.js and data/price-list.md. */

/* Step 1 buttons */
window.ROLE_INFO = {
  driller: { icon: "🛠️", eg: "Drillers, derrickmen, roughnecks, toolpushers" },
  marine: { icon: "🚢", eg: "Masters, mates, deck crew, DP operators" },
  subsea: { icon: "🤿", eg: "ROV pilots, divers, subsea engineers" },
  technician: { icon: "🔧", eg: "Welders, electricians, mechanics, engineers" },
  support: { icon: "🍽️", eg: "Catering, storekeepers, trainees, first-timers" }
};

/* A job category on the site -> which document role to start from */
window.CAT_ROLE = { drilling: "driller", marine: "marine", subsea: "subsea", engineering: "technician", maintenance: "technician", operations: "technician", hse: "technician", logistics: "support", catering: "support", entry: "support" };

/* Step 2 shows only these (about 10 per role). Everything else sits behind "Show more". */
window.DOC_CORE = {
  driller: ["International passport (6–12 months' validity)", "Updated professional CV (offshore format)", "Educational certificates", "Employment reference letters", "Previous offshore work experience records", "BOSIET (or T-BOSIET)", "Valid offshore medical fitness certificate", "IWCF well control certificate", "IADC WellSharp certificate", "Well control and blowout prevention training"],
  marine: ["International passport (6–12 months' validity)", "Updated professional CV (offshore format)", "Seaman's book / discharge book", "STCW Basic Safety Training", "Seafarer medical (ENG1 or equivalent)", "Certificate of Competency (officers) or rating certificate (ABs)", "BOSIET (or T-BOSIET)", "Sea service records", "Flag-state endorsements", "Employment reference letters"],
  subsea: ["International passport (6–12 months' validity)", "Updated professional CV (offshore format)", "BOSIET (or T-BOSIET)", "Valid offshore medical fitness certificate", "ROV pilot / technician training certificates", "Logbook of ROV or diving hours", "Commercial diver qualification (divers only)", "Diving medical (divers only)", "Previous offshore work experience records", "Employment reference letters"],
  technician: ["International passport (6–12 months' validity)", "Updated professional CV (offshore format)", "Trade or engineering qualification certificate", "BOSIET (or T-BOSIET)", "Valid offshore medical fitness certificate", "Welding qualification (for welders, for example 6G)", "Rigging, banksman and slinger certificates", "Working at heights training", "H2S awareness", "Employment reference letters"],
  support: ["International passport (6–12 months' validity)", "Updated professional CV (offshore format)", "Passport-size photographs", "BOSIET (or T-BOSIET)", "Valid offshore medical fitness certificate", "Food hygiene certificate (catering roles)", "First aid certification", "Basic firefighting training", "Police clearance certificate (where required)", "Reference from previous employer or trainer"]
};

/* "Better value" package suggestion. PKG_COVERS lists the separately priced services each package replaces,
   so the saving shown to the applicant comes straight from your own price list. Please confirm these equivalents. */
window.CV_SERVICES = ["General Professional CV", "International Offshore CV", "Technical Offshore CV", "Senior Offshore Professional CV", "Executive Offshore CV"];
window.PKG_FOR_ROLE = { support: "Basic Offshore Documentation Package", _default: "Professional Offshore Documentation Package" };
window.PKG_COVERS = {
  "Basic Offshore Documentation Package": ["International Offshore CV", "Professional Cover Letter", "Professional Biography", "Employment History Documentation", "Complete Applicant Documentation Organization", "Professional Documentation Review"],
  "Professional Offshore Documentation Package": ["Technical Offshore CV", "Job-Specific Cover Letter", "Professional Portfolio", "Technical Skills Portfolio", "Employment History Documentation", "Professional Reference List", "Professional Qualification Gap Assessment", "Professional Documentation Review"],
  "Executive and Specialist Documentation Package": ["Executive Offshore CV", "Professional Cover Letter", "Project Experience Portfolio", "Offshore Personnel Competency Documentation", "Career Experience Summary", "Training Matrix Preparation", "International Document Compliance Review", "Technical Interview Preparation"],
  "Complete International Offshore Career Documentation Package": ["Technical Offshore CV", "Professional Cover Letter", "Technical Skills Portfolio", "Professional Qualification Gap Assessment", "Employment History Documentation", "Offshore Employment Requirements Research", "Immigration Documentation Review", "Professional Reference List", "International Medical Provider Research", "Interview Preparation", "Complete Application Document Organization"]
};
