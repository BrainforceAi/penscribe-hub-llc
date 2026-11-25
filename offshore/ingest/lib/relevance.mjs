/** Keeps the feed to offshore, oil & gas and marine work, and only reports facts the advert actually states. */
const STRONG = /\b(offshore|off-shore|oil\s*(?:and|&|\/)\s*gas|fpso|drill\s?ship|jack-?up|semi-?submersible|north sea|\brig\b|subsea|\brov\b|wellhead|downhole|topside|\blng\b|petroleum|saturation diving|dp operator|dynamic positioning|pipelay|well control|iwcf|bosiet|opito|huet|offshore wind|drilling (?:rig|contractor|crew)|platform (?:operator|crew|technician)|seafarer|stcw)\b/i;
const EXCLUDE_TITLE = /\b(barista|cashier|call cent(?:re|er)|sales assistant|petrol station|gas station|forecourt|oil change|lube tech|hairdress|delivery driver|truck driver|taxi)\b/i;
export const isRelevant = (title, description) => !EXCLUDE_TITLE.test(title) && (STRONG.test(title) || STRONG.test(String(description || "").slice(0, 2000)));

const RULES = [
  ["subsea", /\brov\b|diver|subsea|saturation/i], ["drilling", /driller|derrick|roughneck|mud |drilling|toolpusher|wellsite/i],
  ["logistics", /crane|rigger|banksman|slinger|storekeeper|helideck|logistic|warehouse|forklift|scaffold/i],
  ["marine", /\bmaster\b|\bmate\b|\bdeck\b|dp operator|vessel|marine|bosun|seaman|\bship/i], ["hse", /hse|safety|medic|nurse|environment/i],
  ["entry", /roustabout|trainee|entry|apprentice|graduate|deck hand/i], ["catering", /cook|chef|steward|camp boss|catering|baker/i],
  ["engineering", /engineer|designer|inspector/i], ["maintenance", /mechanic|electrician|welder|fitter|technician|instrument/i],
  ["operations", /operator|production|ccr|oim|offshore installation manager|supervisor/i]
];
export const categorise = title => (RULES.find(([, re]) => re.test(title)) || ["operations"])[0];

/** Only returns a rotation if the advert says one. Never a country default. */
const ROT = /\b(14\/14|21\/21|28\/28|14\/21|21\/28|28\/14|2\/2|2\/3|3\/3|2\/4|3\/4|4\/4|7\/7|6\/6|5\/2|35\/35|42\/42|56\/28)\b/;
export function statedRotation(text) {
  const m = ROT.exec(String(text || "")); if (m) return m[1];
  const w = /\b(\d{1,2})\s*(?:weeks?|days?)\s*on\s*[,\/&-]?\s*(\d{1,2})\s*(?:weeks?|days?)\s*off\b/i.exec(text || ""); return w ? `${w[1]} on / ${w[2]} off` : "";
}
