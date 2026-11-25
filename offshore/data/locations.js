/* Approved service locations (updated per client instruction:
   Africa limited to South Africa; selected Asia-Pacific countries removed). */
window.REGIONS = [
  { name: "Africa", countries: [
    { slug: "south-africa", name: "South Africa", flag: "🇿🇦", basins: "Orange Basin, Bredasdorp Basin, Outeniqua Basin", info: "Offshore exploration and marine support out of Cape Town, Saldanha and Richards Bay.", rotation: "28/28 or 14/14", visa: "Work visa / Critical Skills visa", medical: "OGSA / local offshore medical" } ] },
  { name: "Middle East", countries: [
    { slug: "uae", name: "United Arab Emirates", flag: "🇦🇪", basins: "Abu Dhabi offshore, Zakum, Umm Shaif, Dubai fields", info: "Large offshore oil and gas programme with strong demand for drilling and marine crews.", rotation: "28/28", visa: "Employer-sponsored work visa", medical: "OGUK / OPITO-recognised" },
    { slug: "saudi-arabia", name: "Saudi Arabia", flag: "🇸🇦", basins: "Arabian Gulf: Safaniya, Marjan, Zuluf", info: "The world's largest offshore field operations, with continuous hiring for all disciplines.", rotation: "28/28 or 14/14", visa: "Iqama / employer-sponsored", medical: "Company-approved medical" },
    { slug: "qatar", name: "Qatar", flag: "🇶🇦", basins: "North Field, Al Shaheen", info: "LNG-led offshore expansion with long contracts.", rotation: "28/28", visa: "Employer-sponsored work visa", medical: "OGUK / local" },
    { slug: "kuwait", name: "Kuwait", flag: "🇰🇼", basins: "Offshore Kuwait, Neutral Zone", info: "Growing offshore drilling and platform operations.", rotation: "28/28", visa: "Employer-sponsored", medical: "Local approved" },
    { slug: "oman", name: "Oman", flag: "🇴🇲", basins: "Offshore Block 8, Gulf of Oman", info: "Developing offshore blocks and marine services.", rotation: "28/28", visa: "Employer-sponsored", medical: "Local approved" },
    { slug: "bahrain", name: "Bahrain", flag: "🇧🇭", basins: "Bahrain Field, Khalij Al Bahrain", info: "Offshore gas development and marine logistics.", rotation: "28/28", visa: "Employer-sponsored", medical: "Local approved" },
    { slug: "iraq", name: "Iraq", flag: "🇮🇶", basins: "Basra offshore terminals (Al Basrah Oil Terminal)", info: "Offshore terminals and export facilities in the northern Gulf.", rotation: "28/28", visa: "Employer-sponsored", medical: "Company-approved" } ] },
  { name: "Europe", countries: [
    { slug: "united-kingdom", name: "United Kingdom", flag: "🇬🇧", basins: "UK North Sea (Aberdeen hub)", info: "Mature basin with strong decommissioning and energy-transition work.", rotation: "2/3 or 3/3", visa: "Skilled Worker visa", medical: "OGUK medical" },
    { slug: "norway", name: "Norway", flag: "🇳🇴", basins: "Norwegian North Sea, Barents Sea (Stavanger hub)", info: "High wages and strict safety standards.", rotation: "2/4", visa: "Skilled worker permit", medical: "Norwegian offshore medical" },
    { slug: "netherlands", name: "Netherlands", flag: "🇳🇱", basins: "Dutch North Sea", info: "Gas production, wind and decommissioning.", rotation: "2/2 or 2/3", visa: "Highly skilled migrant", medical: "OGUK / local" },
    { slug: "denmark", name: "Denmark", flag: "🇩🇰", basins: "Danish North Sea (Esbjerg hub)", info: "Oil, gas and carbon storage projects.", rotation: "2/4", visa: "Positive List / Pay Limit", medical: "Danish offshore medical" },
    { slug: "ireland", name: "Ireland", flag: "🇮🇪", basins: "Celtic Sea, Corrib", info: "Gas, marine and offshore energy services.", rotation: "2/2", visa: "Critical Skills permit", medical: "OGUK / local" } ] },
  { name: "Americas", countries: [
    { slug: "usa-gulf-of-mexico", name: "USA: Gulf of Mexico", flag: "🇺🇸", basins: "Deepwater Gulf, Shelf (Houston, Lafayette)", info: "Deepwater drilling and production platforms.", rotation: "14/14 or 7/7", visa: "US work authorisation + TWIC", medical: "Company-approved" },
    { slug: "mexico", name: "Mexico", flag: "🇲🇽", basins: "Bay of Campeche (Ciudad del Carmen)", info: "Shallow-water platforms and marine support.", rotation: "14/14", visa: "Work visa", medical: "Local approved" },
    { slug: "brazil", name: "Brazil", flag: "🇧🇷", basins: "Santos and Campos Basins (Pre-Salt)", info: "Largest FPSO fleet growth worldwide.", rotation: "14/14 or 14/21", visa: "VITEM V work visa", medical: "Local approved" },
    { slug: "guyana", name: "Guyana", flag: "🇬🇾", basins: "Stabroek Block", info: "Fast-growing FPSO developments.", rotation: "28/28 or 21/21", visa: "Work permit", medical: "OGUK / local" },
    { slug: "suriname", name: "Suriname", flag: "🇸🇷", basins: "Block 58", info: "New deepwater development.", rotation: "28/28", visa: "Work permit", medical: "Local approved" },
    { slug: "trinidad-tobago", name: "Trinidad & Tobago", flag: "🇹🇹", basins: "East Coast Marine Area, Columbus Basin", info: "Established gas producer.", rotation: "14/14", visa: "Work permit", medical: "Local approved" },
    { slug: "canada", name: "Canada: Newfoundland", flag: "🇨🇦", basins: "Jeanne d'Arc Basin (Hibernia, Terra Nova)", info: "Harsh-environment offshore operations.", rotation: "21/21", visa: "Work permit", medical: "Atlantic Canada offshore medical" },
    { slug: "colombia", name: "Colombia", flag: "🇨🇴", basins: "Caribbean offshore (Sirius, Uchuva)", info: "Developing offshore gas.", rotation: "14/14", visa: "Work visa", medical: "Local approved" },
    { slug: "argentina", name: "Argentina", flag: "🇦🇷", basins: "Austral Basin, North Argentine Basin", info: "Offshore exploration and Fénix project.", rotation: "14/14", visa: "Work permit", medical: "Local approved" } ] },
  { name: "Asia-Pacific", countries: [
    { slug: "australia", name: "Australia", flag: "🇦🇺", basins: "North West Shelf, Browse, Bass Strait", info: "LNG-focused FPSO and platform operations (Perth, Darwin).", rotation: "2/1 or 14/14", visa: "Skills in Demand visa", medical: "AMOGA / Australian offshore medical" } ] },
  { name: "Caspian & Eurasia", countries: [
    { slug: "azerbaijan", name: "Azerbaijan", flag: "🇦🇿", basins: "ACG, Shah Deniz (Baku)", info: "Long-running Caspian offshore platforms.", rotation: "14/14 or 28/28", visa: "Work permit", medical: "OGUK / local" },
    { slug: "kazakhstan", name: "Kazakhstan", flag: "🇰🇿", basins: "Kashagan, North Caspian", info: "Artificial-island and offshore processing.", rotation: "14/14", visa: "Work permit", medical: "Local approved" },
    { slug: "russia", name: "Russia", flag: "🇷🇺", basins: "Sakhalin Shelf, Caspian, Arctic", info: "Subject to international sanctions screening before any placement.", rotation: "28/28", visa: "Work permit", medical: "Local approved" } ] }
];

window.CATEGORIES = [
  { id: "drilling", name: "Drilling", icon: "🛠️", blurb: "Drillers, derrickmen, roughnecks, mud engineers" },
  { id: "subsea", name: "Subsea & ROV", icon: "🤿", blurb: "ROV pilots, divers, subsea engineers" },
  { id: "marine", name: "Marine & Vessel Crew", icon: "🚢", blurb: "Masters, mates, deck crew, DP operators" },
  { id: "engineering", name: "Engineering", icon: "📐", blurb: "Process, mechanical, electrical, instrument" },
  { id: "hse", name: "HSE & Safety", icon: "🦺", blurb: "HSE advisors, medics, safety officers" },
  { id: "operations", name: "Production & Operations", icon: "⚙️", blurb: "CCR operators, production techs, OIMs" },
  { id: "maintenance", name: "Maintenance & Technical", icon: "🔧", blurb: "Mechanics, electricians, riggers, welders" },
  { id: "logistics", name: "Logistics & Support", icon: "📦", blurb: "Crane operators, storekeepers, helideck crew" },
  { id: "catering", name: "Catering & Hospitality", icon: "🍽️", blurb: "Cooks, stewards, camp bosses" },
  { id: "entry", name: "Entry Level & Trainee", icon: "🌱", blurb: "Roustabouts, trainees, deck hands" }
];

window.CERTS = ["BOSIET / FOET", "HUET", "OPITO", "NEBOSH", "IWCF / IADC WellCAP", "STCW", "Offshore medical", "H2S", "Rigger / Banksman", "None yet"];
window.PARTNERS = 12; /* placeholder count of partner logo tiles */
