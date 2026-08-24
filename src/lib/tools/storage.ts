const SAVED_KEY = "valdir:saved";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadSavedIds(): string[] {
  return readJson<string[]>(SAVED_KEY, []);
}

export function saveSavedIds(ids: string[]) {
  localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
}
