import Block from "..//Block";
import styles from "./UserCard.module.css";

export default function UserCard({ user }) {
	return (
		<Block as="a" href={`/users/${user.username}`} className={user.admin ? styles.UserCardAdmin : styles.UserCard}>
			<div className={`${styles.faceContent}`}>
				<div className={styles.imageWrapper}>
					<img
						src={user.image}
						alt={`${user.name}'s face`}
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
