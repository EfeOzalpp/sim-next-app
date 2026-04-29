import { notFound } from "next/navigation";

import { getThursday, getAdjacentThursdays } from "@/actions/thursdays";
import { getAuthSession } from "@/actions/auth";

import ThursdayNavigation from "@/components/domain/thursdays/ThursdayNavigation";
import ProductionCard from "@/components/domain/thursdays/ProductionCard";
import Split from "@/components/ui/Split";
import { Button } from "@/components/ui/AntD";
import styles from "@/components/domain/thursdays/ThursdayPage.module.css";

interface ThursdayProps {
  params: Promise<{ id: string }>;
}

export default async function Thursday({ params }: ThursdayProps) {
  const { id } = await params;
  const result = await getThursday(id);

  if (!result.success) {
    notFound();
  }
  const thursday = result.data;

  const { isAdmin } = await getAuthSession();

  const adjacentResult = await getAdjacentThursdays(id);
  const { previous, next } = adjacentResult.success
    ? adjacentResult.data
    : { previous: null, next: null };

  return (
    <div className={styles.ThursdayPage}>
      <ThursdayNavigation previous={previous} next={next} />

      <div className={styles.Header}>
        <Split
          start={
            <div>
              <h3 className={styles.DateTitle}>
                {new Date(thursday.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <div className={styles.SemesterSubtitle}>
                {thursday.name}, {(thursday as any).semester?.name}
              </div>
            </div>
          }
          end={
            isAdmin && (
              <Button href={`/thursdays/${thursday.id}/edit`}>
                Edit Thursday
              </Button>
            )
          }
        />
      </div>

      <div className={styles.Productions}>
        {thursday.productions.length > 0 ? (
          thursday.productions.map((production: any) => (
            <ProductionCard
              key={production.id}
              thursday={thursday as any}
              production={production}
              isAdmin={isAdmin}
            />
          ))
        ) : (
          <div className={styles.NoProductions}>
            There are no productions scheduled on this Thursday yet.
          </div>
        )}
      </div>
    </div>
  );
}
