import { notFound } from "next/navigation";

import { getThursday, getAdjacentThursdays } from "@/actions/thursdays";
import { getAuthSession } from "@/actions/auth";

import ThursdayNavigation from "@/components/domain/thursdays/ThursdayNavigation";
import ProductionCard from "@/components/domain/thursdays/ProductionCard";
import ProductionsCollapse from "@/components/domain/thursdays/ProductionsCollapse";
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
    <>
      <Split
        start={<h2 style={{ margin: 0 }}>Thursday</h2>}
        end={
          isAdmin && (
            <Button href={`/thursdays/${thursday.id}/edit`}>
              Edit Thursday
            </Button>
          )
        }
      />

      <ThursdayNavigation previous={previous} next={next} />

      <div className={styles.productions}>
        <div className={styles.ThursdayInfo}>
          <div className={styles.SemesterSubtitle}>
            {thursday.name}, {(thursday as any).semester?.name}
          </div>
          <span className={styles.DateBadge}>
            {new Date(thursday.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {thursday.productions.length > 0 ? (
          <ProductionsCollapse
            formattedDate={new Date(thursday.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            productions={thursday.productions.map((production: any) => ({
              id: production.id,
              name: production.name,
              location: production.location,
              content: (
                <ProductionCard
                  thursday={thursday as any}
                  production={production}
                  isAdmin={isAdmin}
                />
              ),
            }))}
          />
        ) : (
          <div className={styles.NoProductions}>
            There are no productions scheduled on this Thursday yet.
          </div>
        )}
      </div>
    </>
  );
}
