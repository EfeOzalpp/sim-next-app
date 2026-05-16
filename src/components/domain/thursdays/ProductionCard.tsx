import Link from "next/link";
import styles from "@/components/domain/thursdays/ThursdayCard.module.css";
import PresentationCard from "@/components/domain/thursdays/PresentationCard";

interface ProductionCardProps {
  thursday: any;
  production: any;
  isAdmin?: boolean;
}

export default async function ProductionCard({
  thursday,
  production,
  isAdmin = false,
}: ProductionCardProps) {
  const producers = production.producers.filter(
    (user: any) => user.role !== "ADMIN",
  );
  const faculty = production.producers.filter(
    (user: any) => user.role === "ADMIN",
  );

  return (
    <div>
      <div className={styles.People}>
        <div>
          <b>Producers</b>
          <div className={styles.Names}>
            {producers.length > 0 ? (
              producers.map((producer: any) => (
                <Link key={producer.id} href={`/users/${producer.id}`}>
                  {producer.name}
                </Link>
              ))
            ) : (
              <i>No producers credited yet.</i>
            )}
          </div>
        </div>
        <div>
          <b>Faculty</b>
          <div className={styles.Names}>
            {faculty.length > 0 ? (
              faculty.map((facultyMember: any) => (
                <Link key={facultyMember.id} href={`/users/${facultyMember.id}`}>
                  {facultyMember.name}
                </Link>
              ))
            ) : (
              <i>No faculty assigned yet.</i>
            )}
          </div>
        </div>
      </div>

      <div style={{ borderTop: "var(--neo-border)", margin: "0.5rem -16px 0.75rem" }} />

      <div>
        <b>Presentations</b>
        <div style={{ marginTop: "0.5rem" }}>
          {production.presentations.length > 0 ? (
            production.presentations.map((presentation: any) => (
              <PresentationCard
                key={presentation.id}
                presentation={presentation}
              />
            ))
          ) : (
            <p>
              <i>No presentations for this production yet.</i>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
