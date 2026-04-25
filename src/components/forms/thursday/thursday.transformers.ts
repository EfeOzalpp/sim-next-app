import dayjs, { Dayjs } from "dayjs";

/**
 * Transform form data (from React Hook Form) into API payload
 * Used before sending to backend
 */
export function transformThursdayPayload(formData: any) {
  return {
    name: formData.name,
    date: formData.date ? (dayjs.isDayjs(formData.date) ? formData.date.toISOString() : dayjs(formData.date).toISOString()) : null,
    semesterId: formData.semesterId,
    groups: (formData.groups || []).map((group: any) => ({
      id: group.id,
      name: group.name,
      location: group.location,
      producers: group.producers || [],
      presentations: (group.presentations || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        presenters: p.presenters || [],
      })),
    })),
  };
}

/**
 * Transform API response into form shape (React Hook Form)
 * Used when loading existing data for edit
 */
export function transformThursdayFromAPI(apiData: any) {
  if (!apiData) {
    return {
      name: "",
      date: null,
      groups: [],
    };
  }

  return {
    name: apiData.name || "",
    date: apiData.date ? dayjs(apiData.date) : null,
    semesterId: apiData.semester_id || null,
    groups: (apiData.groups || []).map((g: any) => ({
      id: g.id,
      name: g.name || "",
      location: g.location || "",
      producers: (g.producers || []).map((p: any) => p.id),
      presentations: (g.presentations || []).map((p: any) => ({
        id: p.id,
        name: p.name || "",
        presenters: (p.presenters || []).map((pr: any) => pr.id),
      })),
    })),
  };
}
