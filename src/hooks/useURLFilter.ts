"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect, useTransition } from "react";

export function useURLFilter(queryKey: string, debounceMs = 500) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	// Use a nullable value to distinguish between "not in URL" and "empty string in URL"
	const paramValue = searchParams?.get(queryKey);
	const [value, setValue] = useState<string | null>(paramValue);

	// Update local state when URL changes externally (e.g. back button)
	useEffect(() => {
		setValue(paramValue);
	}, [paramValue]);

	const debouncedReplace = useDebouncedCallback((newValue: string | null) => {
		const params = new URLSearchParams(searchParams?.toString());
		
		if (newValue !== null && newValue !== "") {
			params.set(queryKey, newValue);
		} else {
			params.delete(queryKey);
		}

		const newSearchParamsString = params.toString();
		const currentSearchParamsString = searchParams?.toString() || "";

		if (newSearchParamsString !== currentSearchParamsString) {
			startTransition(() => {
				router.replace(`${pathname}?${newSearchParamsString}`, { scroll: false });
			});
		}
	}, debounceMs);

	const handleChange = (newValue: string | null) => {
		setValue(newValue);
		debouncedReplace(newValue);
	};

	return {
		value,
		isPending,
		handleChange,
	};
}
