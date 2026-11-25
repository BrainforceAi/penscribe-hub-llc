/* Countries a visitor can pick as their country of residence, and the currency course prices are shown in.
   Course base prices are in THB and converted with data/rates.js (refresh with ingest/update-rates.mjs). */
window.COUNTRIES = [
  ["US","United States","USD"],["GB","United Kingdom","GBP"],["CA","Canada","CAD"],["AU","Australia","AUD"],["NZ","New Zealand","NZD"],
  ["IE","Ireland","EUR"],["NL","Netherlands","EUR"],["FR","France","EUR"],["DE","Germany","EUR"],["ES","Spain","EUR"],["IT","Italy","EUR"],["PT","Portugal","EUR"],["BE","Belgium","EUR"],["GR","Greece","EUR"],
  ["NO","Norway","NOK"],["DK","Denmark","DKK"],["SE","Sweden","SEK"],["CH","Switzerland","CHF"],["PL","Poland","PLN"],["RO","Romania","RON"],
  ["AE","United Arab Emirates","AED"],["SA","Saudi Arabia","SAR"],["QA","Qatar","QAR"],["KW","Kuwait","KWD"],["OM","Oman","OMR"],["BH","Bahrain","BHD"],["IQ","Iraq","IQD"],["JO","Jordan","JOD"],["TR","Turkey","TRY"],
  ["ZA","South Africa","ZAR"],["NG","Nigeria","NGN"],["GH","Ghana","GHS"],["KE","Kenya","KES"],["TZ","Tanzania","TZS"],["UG","Uganda","UGX"],["ZM","Zambia","ZMW"],["AO","Angola","AOA"],["MZ","Mozambique","MZN"],["NA","Namibia","NAD"],["BW","Botswana","BWP"],
  ["CM","Cameroon","XAF"],["GA","Gabon","XAF"],["CI","Côte d'Ivoire","XOF"],["SN","Senegal","XOF"],["EG","Egypt","EGP"],["MA","Morocco","MAD"],["DZ","Algeria","DZD"],["LY","Libya","LYD"],
  ["IN","India","INR"],["PK","Pakistan","PKR"],["BD","Bangladesh","BDT"],["LK","Sri Lanka","LKR"],["NP","Nepal","NPR"],
  ["PH","Philippines","PHP"],["ID","Indonesia","IDR"],["MY","Malaysia","MYR"],["TH","Thailand","THB"],["VN","Vietnam","VND"],["SG","Singapore","SGD"],["CN","China","CNY"],["HK","Hong Kong","HKD"],["JP","Japan","JPY"],["KR","South Korea","KRW"],["BN","Brunei","BND"],["MM","Myanmar","MMK"],
  ["BR","Brazil","BRL"],["MX","Mexico","MXN"],["AR","Argentina","ARS"],["CO","Colombia","COP"],["CL","Chile","CLP"],["PE","Peru","PEN"],["GY","Guyana","GYD"],["SR","Suriname","SRD"],["TT","Trinidad & Tobago","TTD"],["JM","Jamaica","JMD"],
  ["AZ","Azerbaijan","AZN"],["KZ","Kazakhstan","KZT"],["RU","Russia","RUB"],["UA","Ukraine","UAH"],
  ["ZZ","Other country (US dollars)","USD"]
].map(([code, name, cur]) => ({ code, name, cur }));
