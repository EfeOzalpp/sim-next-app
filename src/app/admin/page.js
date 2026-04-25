import { FilterSelect } from "@/components/ui/Filters";
import { Button } from "@/components/ui/AntD";
import Split from "@/components/ui/Split";
import { getAllSemesters, getAdminSemesterData } from "@/actions/semesters";
import SemesterUsersTable from "@/components/domain/semesters/SemesterUsersTable";

export default async function Admin({ searchParams }) {
  const filters = await searchParams;

  const semesters = await getAllSemesters();
  const semesterId = filters.semesterId || semesters[0]?.id || null;
  const semesterData = semesterId
    ? await getAdminSemesterData(semesterId, filters)
    : null;
  const startDate = semesterData?.semester.thursdays?.length
    ? new Date(
        Math.min(
          ...semesterData.semester.thursdays.map((t) =>
            new Date(t.date).getTime(),
          ),
        ),
      )
    : null;
  const endDate = semesterData?.semester.thursdays?.length
    ? new Date(
        Math.max(
          ...semesterData.semester.thursdays.map((t) =>
            new Date(t.date).getTime(),
          ),
        ),
      )
    : null;
  console.log(semesterData);
  return (
    <div>
      <Split
        start={
          <h2>
            Manage Semester "{semesterData.semester.name}" (
            {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()})
          </h2>
        }
        end={
          <>
            <FilterSelect
              filter="semesterId"
              options={semesters}
              defaultValue={semesterId}
              valueKey="id"
              labelKey="name"
            />
            <Button href={`/admin/semesters/${semesterId}/edit`}>Edit</Button>
            <Button href="/admin/semesters/add">New Semester</Button>
          </>
        }
      />
      <SemesterUsersTable
        semester={semesterData?.semester}
        users={semesterData?.users || []}
      />
    </div>
  );
}
