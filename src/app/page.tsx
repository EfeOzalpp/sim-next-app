import { redirect } from "next/navigation";

// Root home page redirects users to the users list
export default function Home() {
	redirect("/users");
}
