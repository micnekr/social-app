import useSWR from "swr";
import { get } from "lodash";

const jsonFetcher = (selector) => (url) =>
  fetch(url)
    .then((r) => r.json())
    .then((data) => (selector ? get(data, selector, null) : data ?? null));

export function useUser() {
  const { data, isValidating } = useSWR("/api/user", jsonFetcher());
  const user = data?.user ?? null;
  return { user, loading: isValidating };
}
