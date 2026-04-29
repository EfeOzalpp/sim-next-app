import React from "react";

interface ResultsContainerProps {
	children: React.ReactNode;
}

export default function ResultsContainer({ children }: ResultsContainerProps) {
	return (
		<div>
			{children}
		</div>
	);
}
