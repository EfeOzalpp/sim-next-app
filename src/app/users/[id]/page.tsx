import { getUser } from "@/actions/users";
import { getAuthSession } from "@/actions/auth";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/AntD";
import Split from "@/components/ui/Split";
import styles from "@/components/domain/users/User.module.css";
import { LogoutButton } from "@/components/layout/Auth/AuthenticationButtons";
import PresentationCard from "@/components/domain/thursdays/PresentationCard";
import { normalizeFaceImagePath } from "@/helpers";

interface UserProps {
  params: Promise<{ id: string }>;
}

export default async function User({ params }: UserProps) {
  const { id } = await params;
  const result = await getUser(id);
  if (!result.success) return notFound();
  const user = result.data;

  const { user: sessionUser, isAdmin } = await getAuthSession();
  if (!sessionUser) return null;

  const canEdit = isAdmin || user.id === sessionUser.id;

  return (
    <div className={styles.UserTable}>
      <div className={styles.UserImage}>
        <img
          src={normalizeFaceImagePath(user.image || "")}
          alt={`${user.name}'s image`}
        />
      </div>

      <div>
        <Split
          start={
            <div style={{ fontWeight: "bolder", fontSize: "2rem" }}>
              {user.name}
            </div>
          }
          end={
            <>
              {canEdit && (
                <Button
                  href={`/users/${user.id}/edit`}
                  className={styles.EditButton}
                >
                  Edit Profile
                </Button>
              )}
              {user.id === sessionUser.id ? <LogoutButton /> : null}
            </>
          }
        />

        <div className={styles.UserData}>
          {user.admin ? (
            <div className={styles.DataRow}>
              <div className={styles.Label} style={{ color: "#f26419" }}>
                Admin
              </div>
            </div>
          ) : null}

          <div className={styles.DataRow}>
            <div className={styles.Label}>About</div>
            <div className={styles.Value}>
              {(user.about?.length ?? 0) > 0
                ? user.about
                : "This user has not written an about yet."}
            </div>
          </div>

          <div className={styles.DataRow}>
            <div className={styles.Label}>Presentations</div>
            <div className={styles.Value}>
              {(user.presentations?.length ?? 0) > 0 ? (
                user.presentations?.map((presentation: any) => (
                  <PresentationCard
                    key={presentation.id}
                    presentation={presentation}
                    isUserProfile={true}
                  />
                ))
              ) : (
                <i>This user has not made any presentations yet.</i>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
