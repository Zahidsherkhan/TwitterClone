// src/hooks/useAuthUser.js
import { useQuery } from "@tanstack/react-query";

export const useAuthUser = () => {
  const {
    data: authUser,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) throw new Error("Failed to fetch auth user");
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });

  return authUser;
};
