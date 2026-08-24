import { useCallback, useEffect, useState } from "react";
import { loadSavedIds, saveSavedIds } from "@/lib/tools/storage";

export function useSavedTools() {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setIds(loadSavedIds());
    setReady(true);
  }, []);

  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      saveSavedIds(next);
      return next;
    });
  }, []);

  return { ids, ready, toggle, has: (id: string) => ids.includes(id) };
}
