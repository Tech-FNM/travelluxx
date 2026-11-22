import React from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";

export function Link({ to, href, children, ...props }: any) {
  const target = to || href || "/";
  return (
    <NextLink href={target} {...props}>
      {children}
    </NextLink>
  );
}

export function useNavigate() {
  const router = useRouter();
  return (path: string, options?: { replace?: boolean }) => {
    if (typeof window === "undefined") return;
    if (options?.replace) {
      router.replace(path);
    } else {
      router.push(path);
    }
  };
}

export function useParams<T = Record<string, string | string[]>>(): T {
  const router = useRouter();
  const query = (router?.query || {}) as Record<string, any>;

  // If catch-all slug route [[...slug]] is used (e.g. admin tabs)
  if (Array.isArray(query.slug)) {
    const [tab, subtab, id] = query.slug;
    return {
      ...query,
      tab,
      subtab,
      id,
      slug: query.slug[query.slug.length - 1],
    } as any;
  }

  return query as any;
}

export function useLocation() {
  const router = useRouter();
  return {
    pathname: router?.pathname || "/",
    search: typeof window !== "undefined" ? window.location.search : "",
    hash: typeof window !== "undefined" ? window.location.hash : "",
  };
}

