import Split from "@/components/ui/Split";
import { Button } from "@/components/ui/AntD";
import styles from "./ThursdayNavigation.module.css";

interface ThursdayNavigationProps {
	previous: { id: string; name: string; date: Date } | null;
	next: { id: string; name: string; date: Date } | null;
}

export default function ThursdayNavigation({ previous, next }: ThursdayNavigationProps) {
	return (
		<div className={styles.ThursdayNavigation}>
			<Split
				start={
					previous && (
						<Button
							href={`/thursdays/${previous.id}`}
							className={styles.GreyButton}
						>
							<span style={{ fontSize: "1.2rem", color: "#555", marginRight: "6px", lineHeight: 1 }}>←</span>Prior: {previous.name}
						</Button>
					)
				}
				end={
					next && (
						<Button
							href={`/thursdays/${next.id}`}
							className={styles.GreyButton}
						>
							Next: {next.name}<span style={{ fontSize: "1.2rem", color: "#555", marginLeft: "6px", lineHeight: 1 }}>→</span>
						</Button>
					)
				}
			/>
		</div>
	);
}
