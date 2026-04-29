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
							← Previous Day: {previous.name} ({new Date(previous.date).toLocaleDateString()})
						</Button>
					)
				}
				end={
					next && (
						<Button 
							href={`/thursdays/${next.id}`}
							className={styles.GreyButton}
						>
							Next Day: {next.name} ({new Date(next.date).toLocaleDateString()}) →
						</Button>
					)
				}
			/>
		</div>
	);
}
