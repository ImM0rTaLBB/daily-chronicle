/**
 * Live News & Telemetry Fetcher
 * Pulls verifiable real-world reporting from BBC, The Thaiger, Bangkok Post, Hacker News, Science Daily, Open-Meteo, Wikipedia
 */
const RSS2JSON_ENDPOINT = "https://api.rss2json.com/v1/api.json?rss_url=";

const FEEDS = {
  thailand: "https://thethaiger.com/feed",
  world: "https://feeds.bbci.co.uk/news/world/rss.xml",
  techHackerNews: "https://hnrss.org/frontpage?points=100",
  techCrunch: "https://techcrunch.com/feed/",
  science: "https://www.sciencedaily.com/rss/all.xml",
  business: "https://feeds.bbci.co.uk/news/business/rss.xml"
};

export async function fetchDailySources() {
  const [thaiRes, worldRes, hnRes, tcRes, sciRes, bizRes] = await Promise.allSettled([
    fetchRss(FEEDS.thailand),
    fetchRss(FEEDS.world),
    fetchRss(FEEDS.techHackerNews),
    fetchRss(FEEDS.techCrunch),
    fetchRss(FEEDS.science),
    fetchRss(FEEDS.business)
  ]);

  return {
    thailand: thaiRes.status === "fulfilled" ? thaiRes.value : [],
    world: worldRes.status === "fulfilled" ? worldRes.value : [],
    techHN: hnRes.status === "fulfilled" ? hnRes.value : [],
    techCrunch: tcRes.status === "fulfilled" ? tcRes.value : [],
    science: sciRes.status === "fulfilled" ? sciRes.value : [],
    business: bizRes.status === "fulfilled" ? bizRes.value : []
  };
}

async function fetchRss(url) {
  try {
    const res = await fetch(`${RSS2JSON_ENDPOINT}${encodeURIComponent(url)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.items && Array.isArray(data.items) ? data.items : [];
  } catch (e) {
    return [];
  }
}

/**
 * Live Bangkok Weather (Open-Meteo)
 */
export async function fetchLiveWeather(lat = 13.7563, lon = 100.5018) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,weather_code&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export function interpretWeatherCode(code) {
  if (code === 0) return { symbol: "☀️", text: "Clear Skies" };
  if (code === 1 || code === 2) return { symbol: "🌤️", text: "Partly Cloudy" };
  if (code === 3) return { symbol: "☁️", text: "Overcast Atmosphere" };
  if (code >= 45 && code <= 48) return { symbol: "🌫️", text: "Misty Haze" };
  if (code >= 51 && code <= 67) return { symbol: "🌧️", text: "Tropical Rain" };
  if (code >= 80 && code <= 82) return { symbol: "🌦️", text: "Passing Showers" };
  if (code >= 95) return { symbol: "⛈️", text: "Tropical Squalls" };
  return { symbol: "⛅", text: "Warm & Breezy" };
}

/**
 * Live Market Tickers & Thai Baht Rates
 * Fetches USD/THB, JPY/THB, CNY/THB, Crypto (BTC, ETH), S&P 500, Gold, Crude Oil, and Shell Thailand Oil
 */
export async function fetchLiveMarkets() {
  try {
    const [cryptoRes, fxRes] = await Promise.allSettled([
      fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,thb&include_24hr_change=true"),
      fetch("https://open.er-api.com/v6/latest/USD")
    ]);

    let crypto = null;
    let fx = null;

    if (cryptoRes.status === "fulfilled" && cryptoRes.value.ok) {
      crypto = await cryptoRes.value.json();
    }
    if (fxRes.status === "fulfilled" && fxRes.value.ok) {
      fx = await fxRes.value.json();
    }

    return { crypto, fx };
  } catch (e) {
    return null;
  }
}

/**
 * Wikipedia Historical Event for the day
 */
export async function fetchWikiHistory(month, day) {
  try {
    const mStr = String(month).padStart(2, "0");
    const dStr = String(day).padStart(2, "0");
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/selected/${mStr}/${dStr}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.selected || data.events || [];
  } catch (e) {
    return [];
  }
}
