import Block from "@/components/ui/Block";
import Image from "next/image";
import styles from "@/components/domain/users/UserCard.module.css";
import { normalizeFaceImagePath } from "@/helpers";

import { User } from "@prisma/client";

interface UserCardProps {
  user: Pick<User, "id" | "name" | "image" | "role">;
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <Block
      as="a"
      href={`/users/${user.id}`}
      className={`${user.role === "ADMIN" ? styles.UserCardAdmin : styles.UserCard} neo-pressable`}
    >
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
        <div className={styles.role}>{user.role.charAt(0) + user.role.slice(1).toLowerCase()}</div>
      </div>
    </Block>
  );
}
