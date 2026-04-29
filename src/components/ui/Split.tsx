import styles from "@/components/ui/Split.module.css";
import React, { ReactNode } from "react";
import clsx from "clsx";

interface SplitProps {
	start: ReactNode;
	end: ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

// A responsive layout component that displays two elements side-by-side
// Automatically stacks them vertically when space is tight using Container Queries
export default function Split({ start, end, className, style }: SplitProps) {
	return (
		<div className={clsx(styles.container, className)} style={style}>
			<div className={styles.split}>
				<div className={styles.start}>{start}</div>
				<div className={styles.end}>{end}</div>
			</div>
		</div>
	);
}
