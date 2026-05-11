import { auth } from "@/authentication";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	const session = await auth();
	const isAdmin = session?.user?.role === "ADMIN";

	if (isAdmin) {
		return <>{children}</>;
	} else {
		return <div>You do not have access to this page.</div>;
	}
}
