import { z } from "zod";

export const UserSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email address"),
	username: z.string().optional(),
	image: z.string().optional(),
	pronouns: z.string().optional(),
	link: z.string().url("Invalid URL").or(z.literal("")).optional(),
	about: z.string().optional(),
	admin: z.boolean().default(false),
});

export const SemesterSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1, "Semester name is required"),
	dates: z.array(z.string()).optional(),
	users: z.array(z.string()).optional(), // array of user IDs
});

export const ThursdaySchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	date: z.date().or(z.string()),
	semester_id: z.string().optional(),
});

export const GroupSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1, "Group name is required"),
	location: z.string().min(1, "Location is required"),
	thursday_id: z.string().optional(),
});

export const WorkSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1, "Work name is required"),
	image: z.string().min(1, "Image is required"),
	about: z.string().min(1, "About is required"),
	group_id: z.string().optional(),
});
