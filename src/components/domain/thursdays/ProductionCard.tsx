import Link from "next/link";
import styles from "@/components/domain/thursdays/ThursdayCard.module.css";
import Split from "@/components/ui/Split";
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
    (user: any) => user.role === "ADMIN" === false,
  );
  const faculty = production.producers.filter(
    (user: any) => user.role === "ADMIN" === true,
  );
  return (
    <div className={styles.ProductionCard}>
      <Split
        style={{ marginBottom: "0.5rem" }}
        start={
          <h4 style={{ fontSize: "1.2rem" }}>
            <b>{production.name}</b> ({production.location})
          </h4>
        }
        end={<div />}
      />
      <hr />
      <div className={styles.People}>
        <div>
          <b>Producers:</b>
          <ul>
            {producers.length > 0 ? (
              producers.map((producer: any) => {
                return (
                  <li key={`producer.id:${producer.id}`}>
                    <Link href={`/users/${producer.id}`}>{producer.name}</Link>
                  </li>
                );
              })
            ) : (
              <li>
                <i>There are no producers credited for this production yet.</i>
              </li>
            )}
          </ul>
        </div>
        <div>
          <b>Faculty:</b>
          <ul>
            {faculty.length > 0 ? (
              faculty.map((facultyMember: any) => {
                return (
                  <li key={`faculty.id:${facultyMember.id}`}>
                    <Link href={`/users/${facultyMember.id}`}>
                      {facultyMember.name}
                    </Link>
                  </li>
                );
              })
            ) : (
              <li>
                <i>There are no faculty assigned to this production yet.</i>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div>
        <b>Presentations:</b>
        <div
          style={{
            paddingRight: "1rem",
            paddingLeft: "1rem",
            paddingTop: "0",
            paddingBottom: "0",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {production.presentations.length > 0 ? (
            production.presentations?.map((presentation: any) => {
              return (
                <PresentationCard
                  key={presentation.id}
                  presentation={presentation}
                />
              );
            })
          ) : (
            <p>
              <i>There are no presentations for this production yet.</i>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
