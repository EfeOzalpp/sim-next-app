import dayjs from "dayjs";

export function getSemesterDateRange(semester: any) {
  if (!semester?.thursdays?.length) return [null, null];

  const sortedDates = semester.thursdays
    .map((t: any) => new Date(t.date))
    .sort((a: any, b: any) => a.getTime() - b.getTime());

  return [dayjs(sortedDates[0]), dayjs(sortedDates[sortedDates.length - 1])];
}

export const transformSemesterFromAPI = (semester: any, usersFromCurrentSemester: any) => {
  if (!semester) {
    return {
      name: "",
      dates: [null, null],
      users: usersFromCurrentSemester?.map(({ id }: any) => id) || [],
    };
  }

  return {
    id: semester.id,
    name: semester.name,
    dates: getSemesterDateRange(semester),
    users: semester.users?.map(({ id }: any) => id) || [],
  };
};

export const transformSemesterPayload = (formData: any) => {
  return {
    ...formData,
    dates: [
      formData.dates?.[0]?.toDate ? formData.dates[0].toDate() : formData.dates?.[0],
      formData.dates?.[1]?.toDate ? formData.dates[1].toDate() : formData.dates?.[1],
    ],
  };
};
