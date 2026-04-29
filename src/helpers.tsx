import React, { ReactNode } from "react";
import { ActionResult } from "@/actions/utilities";

// Retrieve items from an array based on a list of selected keys
export function getArrayfromSelectedKeys<T extends { key: string | number }>(array: T[] = [], selectedKeys: (string | number)[] = []): T[] {
	const map = new Map((array || []).map((obj) => [obj.key, obj]));
	return (selectedKeys || []).map((key) => map.get(key)).filter((item): item is T => !!item);
}

// Format an array of React elements into a human-readable list (e.g., "A, B, and C")
export function formatNiceListFromArray(elements: ReactNode[] = []): ReactNode {
	if (!elements.length) return null;

	const items = elements.filter(React.isValidElement);

	if (items.length === 0) return null;
	if (items.length === 1) return items[0];
	if (items.length === 2)
		return (
			<>
				{items[0]} and {items[1]}
			</>
		);

	const firstItems = items.slice(0, -1).map((el, idx) => <React.Fragment key={idx}>{el}, </React.Fragment>);

	const lastItem = items[items.length - 1];

	return (
		<>
			{firstItems}and {lastItem}
		</>
	);
}

// Ensure user profile image paths are consistent and fallback to default
export function normalizeFaceImagePath(imagePath?: string | null): string {
	if (!imagePath || imagePath === "/faces/default.jpg" || imagePath === "faces/default.jpg") {
		return "/face.jpg";
	}

	return imagePath;
}

// Common wrapper for form submissions to handle Next.js redirects and standardized action results
export async function handleFormAction<T>(
	actionPromise: () => Promise<ActionResult<T> | T | void>, 
	setError: (error: string | null) => void, 
	defaultErrorMessage: string = "An error occurred."
): Promise<ActionResult<T> | T | void> {
	try {
		setError(null);
		const result = await actionPromise();
		
		if (result && typeof result === "object" && "success" in result && result.success === false) {
			setError(result.error || defaultErrorMessage);
			return result;
		}
		
		return result;
	} catch (err: unknown) {
		// Forward Next.js redirect errors so they can be handled by the framework
		if (err instanceof Error) {
			const errorWithDigest = err as Error & { digest?: string };
			if (err.message === "NEXT_REDIRECT" || (errorWithDigest.digest && typeof errorWithDigest.digest === "string" && errorWithDigest.digest.includes("NEXT_REDIRECT"))) {
				throw err;
			}
			setError(err.message || defaultErrorMessage);
		} else {
			setError(defaultErrorMessage);
		}
	}
}
