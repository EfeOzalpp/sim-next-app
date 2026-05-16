import Link from "next/link";
import styles from "@/components/domain/thursdays/PresentationCard.module.css";
import { formatNiceListFromArray } from "@/helpers";
import { Prisma } from "@prisma/client";
import clsx from "clsx";

type PresentationWithPresenters = Prisma.PresentationGetPayload<{
  include: {
    presenters: {
      select: {
        id: true;
        name: true;
        image: true;
      };
    };
    production: {
      select: {
        thursday_id: true;
      };
    };
  };
}>;

interface PresentationCardProps {
  presentation: PresentationWithPresenters;
  isUserProfile?: boolean;
}

export default function PresentationCard({
  presentation,
  isUserProfile = false,
}: PresentationCardProps) {
  const authors = (presentation.presenters || []).map((author) => (
    isUserProfile ? (
      <span key={`author.id:${author.id}`}>{author.name}</span>
    ) : (
      <Link key={`author.id:${author.id}`} href={`/users/${author.id}/`}>
        {author.name}
      </Link>
    )
  ));

  const thursdayId = (presentation as any).production?.thursday_id;

  if (!isUserProfile) {
    return (
      <div className={styles.Presentation}>
        <div className={styles.PresentationInner}>
          {presentation.about !== "" ? (
            <div><i>{presentation.about}</i></div>
          ) : null}
          {authors.length > 0 ? (
            <div className={styles.Authors}>{formatNiceListFromArray(authors)}</div>
          ) : (
            <div>No one is credited yet.</div>
          )}
        </div>
      </div>
    );
  }

  const content = (
    <div className={styles.PresentationInner}>
      <div><b>{presentation.name}</b></div>
      {presentation.about !== "" ? (
        <div><i>{presentation.about}</i></div>
      ) : null}
      {authors.length > 0 ? (
        <div className={styles.Authors}>{formatNiceListFromArray(authors)}</div>
      ) : (
        <div>No one is credited as an author of this presentation yet.</div>
      )}
    </div>
  );

  return (
    <Link
      href={thursdayId ? `/thursdays/${thursdayId}` : "#"}
      className={clsx(styles.Presentation, styles.GreyButton)}
    >
      {content}
    </Link>
  );
}
