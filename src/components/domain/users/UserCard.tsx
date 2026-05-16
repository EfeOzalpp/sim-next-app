import Block from "@/components/ui/Block";
import Image from "next/image";
import styles from "@/components/domain/users/UserCard.module.css";
import { normalizeFaceImagePath } from "@/helpers";

import { User } from "@prisma/client";

interface UserCardProps {
  user: Pick<User, "id" | "name" | "image" | "role">;
}

export default function UserCard({ user }: UserCardProps) {
  const roleLabel = user.role.charAt(0) + user.role.slice(1).toLowerCase();

  return (
    <Block
      as="a"
      href={`/users/${user.id}`}
      className={`${styles.UserCard} neo-pressable neo-brutal-button`}
    >
      <div className={styles.cardInner}>
        <div className={styles.imageSection}>
          <Image
            src={normalizeFaceImagePath(user.image)}
            alt={`${user.name}'s face`}
            fill
            style={{ objectFit: "cover" }}
          />
          {user.role !== "STUDENT" && <span className={styles.roleLabel}>{roleLabel}</span>}
        </div>
        <div className={styles.nameSection}>
          <div className={styles.name}>{user.name}</div>
        </div>
      </div>
    </Block>
  );
}
