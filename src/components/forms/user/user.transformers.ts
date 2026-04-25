export const transformUserFromAPI = (user: any) => {
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    name: user.name || "",
    pronouns: user.pronouns || "",
    image: user.image || "/face.jpg",
    email: user.email || "",
    link: user.link || "",
    about: user.about || "",
    admin: user.admin || false,
  };
};

export const transformUserPayload = (formData: any) => {
  return {
    ...formData,
    // Ensure email is trimmed if needed, etc.
  };
};
