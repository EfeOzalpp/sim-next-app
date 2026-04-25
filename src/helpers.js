import React from "react";

export function getArrayfromSelectedKeys(array = [], selectedKeys = []) {
	const map = new Map((array || []).map((obj) => [obj.key, obj]));
	return (selectedKeys || []).map((key) => map.get(key)).filter(Boolean); // remove undefined
}

export function formatNiceListFromArray(elements = []) {
	if (!elements.length) return null;

	// Filter out any non-elements just in case
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

export function normalizeFaceImagePath(imagePath) {
	if (!imagePath || imagePath === "/faces/default.jpg" || imagePath === "faces/default.jpg") {
		return "/face.jpg";
	}

	return imagePath;
}

/**
 * Common wrapper for form submissions to handle Next.js redirects and standardized action results
 */
export async function handleFormAction(actionPromise, setError, defaultErrorMessage = "An error occurred.") {
	try {
		setError(null);
		const result = await actionPromise();
		
		if (result && result.success === false) {
			setError(result.error || defaultErrorMessage);
			return result;
		}
		
		return result;
	} catch (err) {
		// Next.js redirect throws a specific error that should not be caught as a regular error
		if (err.message === "NEXT_REDIRECT" || err.digest?.includes("NEXT_REDIRECT")) {
			throw err;
		}
		setError(err.message || defaultErrorMessage);
	}
}
