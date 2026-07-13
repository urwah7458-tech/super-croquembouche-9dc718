import { useEffect, useState } from "react";
import { fetchContent, type Doctor, type PageContentRow } from "../lib/api";

export function useClinicContent() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [pageContent, setPageContent] = useState<PageContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchContent()
      .then((data) => {
        if (!active) return;
        setDoctors(data.doctors);
        setPageContent(data.pageContent);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message ?? "Failed to load content");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { doctors, pageContent, loading, error };
}
