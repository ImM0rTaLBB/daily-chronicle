/**
 * Storage Manager for Daily Editions with Pagination
 */
const STORAGE_INDEX_KEY = "daily_chronicle_archive_index";
const STORAGE_PREFIX = "daily_chronicle_edition_";

export function getArchiveIndex() {
  try {
    const raw = localStorage.getItem(STORAGE_INDEX_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveEditionToArchive(dateStr, editionData) {
  try {
    const key = `${STORAGE_PREFIX}${dateStr}`;
    localStorage.setItem(key, JSON.stringify(editionData));

    const index = getArchiveIndex();
    if (!index.some(item => item.date === dateStr)) {
      index.unshift({
        date: dateStr,
        title: editionData.pages?.[2]?.title || "Daily Morning Edition",
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify(index.slice(0, 180))); // Up to 6 months
    }
  } catch (e) {
    console.warn("Storage write error:", e);
  }
}

export function getEditionFromArchive(dateStr) {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${dateStr}`);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function deleteEditionFromArchive(dateStr) {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${dateStr}`);
    let index = getArchiveIndex();
    index = index.filter(item => item.date !== dateStr);
    localStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify(index));
  } catch (e) {
    console.warn("Delete error:", e);
  }
}

/**
 * Return archive grouped by month, sorted descending (latest month first)
 * Covers stored months plus at least the past 6 calendar months.
 */
export function getArchiveMonths(baseDate = new Date()) {
  const index = getArchiveIndex();
  const monthMap = new Map();

  // 1. Gather all calendar months for the past 6 months from baseDate
  const currYear = baseDate.getFullYear();
  const currMonth = baseDate.getMonth(); // 0-indexed

  for (let i = 0; i < 6; i++) {
    const d = new Date(currYear, currMonth - i, 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthMap.set(ym, []);
  }

  // 2. Add any stored editions into their respective months
  index.forEach(item => {
    let ym = item.date ? item.date.slice(0, 7) : null;
    if (!ym && item.createdAt) {
      ym = item.createdAt.slice(0, 7);
    }
    if (!ym) ym = `${currYear}-${String(currMonth + 1).padStart(2, "0")}`;

    if (!monthMap.has(ym)) {
      monthMap.set(ym, []);
    }
    monthMap.get(ym).push(item);
  });

  // 3. Sort keys descending (newest month first)
  const sortedKeys = Array.from(monthMap.keys()).sort((a, b) => b.localeCompare(a));

  return sortedKeys.map(key => {
    const [year, month] = key.split("-");
    const d = new Date(Number(year), Number(month) - 1, 1);
    const label = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    return {
      key,
      label,
      items: monthMap.get(key)
    };
  });
}
