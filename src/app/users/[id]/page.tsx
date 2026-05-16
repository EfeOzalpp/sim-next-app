import { getUser } from "@/actions/users";
import { getAuthSession } from "@/actions/auth";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/AntD";
import Split from "@/components/ui/Split";
import styles from "@/components/domain/users/User.module.css";
import { LogoutButton } from "@/components/layout/Auth/AuthenticationButtons";
import PresentationCard from "@/components/domain/thursdays/PresentationCard";
import { normalizeFaceImagePath } from "@/helpers";
import { LinkOutlined } from "@ant-design/icons";

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
    <>
      <Split
        className={styles.profileSplit}
        start={
          <div style={{ fontWeight: "bolder", fontSize: "2rem" }}>
            {user.name}
          </div>
        }
        end={
          <>
            {canEdit && (
              <Button href={`/users/${user.id}/edit`}>Edit Profile</Button>
            )}
            {user.id === sessionUser.id ? <LogoutButton /> : null}
          </>
        }
      />
      <div className={styles.pageWrapper}>
        <div className={styles.UserTable}>
          <div className={styles.UserImage}>
            <img
              src={normalizeFaceImagePath(user.image || "")}
              alt={`${user.name}'s image`}
            />
          </div>
          <div className={styles.UserData}>
            <div className={styles.RoleBadge}>
              {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
            </div>
            {(user.link?.length ?? 0) > 0 && (
              <div className={styles.DataRow}>
                <div className={styles.Label}>Link</div>
                <div className={styles.Value}>
                  <a href={user.link!} target="_blank" rel="noopener noreferrer" className={styles.LinkValue}>
                    <LinkOutlined /> {user.link}
                  </a>
                </div>
              </div>
            )}
            <div className={styles.DataRow}>
              <div className={styles.Label}>Pronouns</div>
              <div className={styles.Value}>
                {(user.pronouns?.length ?? 0) > 0
                  ? user.pronouns
                  : <span className={styles.infoText}>This user has not set their pronouns yet.</span>}
              </div>
            </div>
            <div className={styles.DataRow}>
              <div className={styles.Label}>About</div>
              <div className={styles.Value}>
                {(user.about?.length ?? 0) > 0
                  ? user.about
                  : <span className={styles.infoText}>This user has not written an about yet.</span>}
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
                  <span className={styles.infoText}>This user has not made any presentations yet.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
