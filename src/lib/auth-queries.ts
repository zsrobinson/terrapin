import { queryOptions } from "@tanstack/react-query";
import { getSession } from "./auth-functions";

export const sessionQuery = queryOptions({
  queryKey: ["session"],
  queryFn: () => getSession(),
  staleTime: 5 * 60 * 1000,
});
