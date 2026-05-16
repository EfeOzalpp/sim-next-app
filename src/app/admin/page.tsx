import { FilterInput, FilterSelect } from "@/components/ui/Filters";
import { Button } from "@/components/ui/AntD";
import Split from "@/components/ui/Split";
import { getAllSemesters, getAdminSemesterData } from "@/actions/semesters";
import SemesterUsersTable from "@/components/domain/semesters/SemesterUsersTable";
import ResultsContainer from "@/components/ui/ResultsContainer";
import styles from "@/app/admin/page.module.css";

interface AdminProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Admin({ searchParams }: AdminProps) {
  const filters = await searchParams;

  const semestersResult = await getAllSemesters();
  const semesters = semestersResult.success ? semestersResult.data : [];
  const semesterId = (filters.semesterId as string) || semesters[0]?.id || null;

  const semesterDataResult = semesterId
    ? await getAdminSemesterData(semesterId, filters)
    : null;
  const semesterData = semesterDataResult?.success
    ? semesterDataResult.data
    : null;

  const startDate = semesterData?.semester?.thursdays?.length
    ? new Date(
        Math.min(
          ...semesterData.semester.thursdays.map((t: any) =>
            new Date(t.date).getTime(),
          ),
        ),
      )
    : null;
  const endDate = semesterData?.semester?.thursdays?.length
    ? new Date(
        Math.max(
          ...semesterData.semester.thursdays.map((t: any) =>
            new Date(t.date).getTime(),
          ),
        ),
      )
    : null;

  return (
    <>
      <Split
        start={<h2>Manage Semester</h2>}
        end={
          <>
            <FilterInput query="user" placeholder="Search" />
            <FilterSelect
              filter="semesterId"
              options={semesters}
              defaultValue={semesterId}
              valueKey="id"
              labelKey="name"
            />
            <Button href="/admin/semesters/add">New Semester</Button>
            {semesterId && (
              <Button href={`/admin/semesters/${semesterId}/edit`}>
                Edit {semesterData?.semester?.name}
              </Button>
            )}
          </>
        }
      />

      <Split
        className={styles.infoBar}
        start={
          <span className={styles.viewingLabel}>
            {semesterData?.semester?.name}
          </span>
        }
        end={
          startDate && endDate ? (
            <span className={styles.dateBadge}>
              {startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} — {endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          ) : null
        }
      />

      <div className={styles.tableWrapper}>
        <ResultsContainer>
          <SemesterUsersTable
            semester={semesterData?.semester}
            users={semesterData?.users || []}
          />
        </ResultsContainer>
      </div>
    </>
  );
}
