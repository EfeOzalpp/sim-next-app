import Block from "@/components/ui/Block";
import Image from "next/image";
import styles from "@/components/domain/users/UserCard.module.css";
import { normalizeFaceImagePath } from "@/helpers";

export default function UserCard({ user }) {
	return (
		<Block as="a" href={`/users/${user.username}`} className={user.admin ? styles.UserCardAdmin : styles.UserCard}>
			<div className={`${styles.faceContent}`}>
				<div className={styles.imageWrapper}>
					<Image
						src={normalizeFaceImagePath(user.image)}
						alt={`${user.name}'s face`}
						fill
						style={{
							objectFit: "cover",
							borderRadius: "5px",
							border: "2px solid #222222",
						}}
					/>
				</div>
				<div className={styles.name}>{user.name}</div>
			</div>
		</Block>
	);
}
