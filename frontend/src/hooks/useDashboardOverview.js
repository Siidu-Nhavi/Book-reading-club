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
    const useRealRentals = import.meta.env.VITE_USE_REAL_DASHBOARD_RENTALS === "true";

    const loadOverview = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getDashboardOverview(user, { useRealRentals });

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
