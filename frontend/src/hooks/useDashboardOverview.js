import { useEffect, useState } from "react";
import { getDashboardOverview } from "../lib/dashboardApi";

export default function useDashboardOverview(user) {
  const [overview, setOverview] = useState({
    userSummary: null,
    stats: [],
    rentals: [],
    listedBooks: [],
    wishlist: [],
    activity: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadOverview = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getDashboardOverview(user);

        if (!isMounted) {
          return;
        }

        setOverview(response);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setError(requestError.message || "Unable to load the dashboard right now.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadOverview();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return { ...overview, loading, error };
}
