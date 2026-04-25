import { LoginButton } from "@/components/layout/Auth/AuthenticationButtons";

export default function Welcome() {
	return (
		<div style={{ display: "flex", justifyContent: "center" }}>
			<div style={{ maxWidth: "40rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
				<h1>
					<b>Welcome to SIM</b>
				</h1>
				<p>
					This is a private website for the students and faculty of <b>Studio for Interrelated Media (SIM)</b> department of the{" "}
					<b>Massachusetts College of Art and Design</b>. Please login with your MassArt account to continue.
				</p>
				<h2 style={{ textAlign: "center" }}>
					<LoginButton />
				</h2>
				<p style={{ color: "#e75f05" }}>
					<i>If you cannot login with your MassArt account, contact the SIM faculty for help.</i>
				</p>
			</div>
		</div>
	);
}
