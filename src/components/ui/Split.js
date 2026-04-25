import styles from "@/components/ui/Split.module.css";
import clsx from "clsx";

/**
 * A responsive layout component that displays two elements side-by-side
 * and automatically stacks them vertically when space is tight using Container Queries.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.start - Element to display on the left (desktop) or top (mobile)
 * @param {React.ReactNode} props.end - Element to display on the right (desktop) or bottom (mobile)
 * @param {string} [props.className] - Additional class names for the container
 * @param {React.CSSProperties} [props.style] - Inline styles for the container
 */
export default function Split({ start, end, className, style }) {
	return (
		<div className={clsx(styles.container, className)} style={style}>
			<div className={styles.split}>
				<div className={styles.start}>{start}</div>
				<div className={styles.end}>{end}</div>
			</div>
		</div>
	);
}
