import { UserInput } from "@/components/forms/schemas";

export const transformUserFromAPI = (user: any): UserInput | null => {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    pronouns: user.pronouns || "",
    image: user.image || "/face.jpg",
    email: user.email,
    link: user.link || "",
    about: user.about || "",
    role: user.role || "STUDENT",
    semesterIds: user.semesters?.map((s: any) => s.id) || [],
  };
};

export const transformUserPayload = (formData: any) => {
  return {
    ...formData,
  };
};
