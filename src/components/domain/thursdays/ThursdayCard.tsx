import Link from "next/link";
import styles from "@/components/domain/thursdays/ThursdayCard.module.css";
import { Button } from "@/components/ui/AntD";
import Split from "@/components/ui/Split";
import ProductionCard from "@/components/domain/thursdays/ProductionCard";
import { auth } from "@/authentication";
import Block from "@/components/ui/Block";

import { Prisma } from "@prisma/client";

type ThursdayWithProductions = Prisma.ThursdayGetPayload<{
  include: {
    productions: {
      include: {
        producers: { select: { id: true; name: true; image: true } };
        presentations: {
          include: {
            presenters: { select: { id: true; name: true; image: true } };
          };
        };
      };
    };
  };
}>;

interface ThursdayCardProps {
  thursday: ThursdayWithProductions;
  isAdmin?: boolean;
}

export default async function ThursdayCard({
  thursday,
  isAdmin: initialIsAdmin,
}: ThursdayCardProps) {
  let isAdmin = initialIsAdmin;
  if (isAdmin === undefined) {
    const session = await auth();
    isAdmin = session?.user?.admin ?? false;
  }

  return (
    <Block as="div" className={styles.ThursdayCard} pressable={false}>
      <Split
        start={
          <h2 className={styles.Title}>
            <Link href={`/thursdays/${thursday.id}`}>
              <b>{thursday.name}</b> ({thursday.date.toLocaleDateString()})
            </Link>
          </h2>
        }
        end={
          isAdmin && (
            <Button href={`/thursdays/${thursday.id}/edit`}>
              Edit Thursday
            </Button>
          )
        }
      />

      <div className={styles.ProductionsTable}>
        {thursday.productions.length > 0 ? (
          thursday.productions.map((production: any) => (
            <ProductionCard
              key={production.id}
              thursday={thursday}
              production={production}
              isAdmin={isAdmin}
            />
          ))
        ) : (
          <div>There are no productions scheduled on this Thursday yet.</div>
        )}
      </div>
    </Block>
  );
}
