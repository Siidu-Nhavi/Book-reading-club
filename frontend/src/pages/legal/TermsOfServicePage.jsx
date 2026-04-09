import FooterPageTemplate from "../shared/FooterPageTemplate";

const sections = [
	{
		title: "Using The Platform Responsibly",
		description:
			"BookNest is intended to remain respectful, safe, and useful for every reader who joins the platform.",
		points: [
			"Users should avoid harmful, abusive, misleading, or disruptive behavior.",
			"Community participation should stay respectful even when opinions differ.",
			"Platform access should be used for reading, discovery, and constructive interaction.",
		],
	},
	{
		title: "Account And Access",
		description:
			"Each user is responsible for the activity connected to their own account and login credentials.",
		points: [
			"Keep login information secure and avoid sharing account access with others.",
			"Notify support if there is reason to believe an account has been compromised.",
			"Use accurate information when creating and maintaining an account profile.",
		],
	},
	{
		title: "Platform Updates And Limits",
		description:
			"Like most digital products, BookNest may evolve over time as new features are introduced and older ones are improved.",
		points: [
			"Features may be updated, adjusted, or refined as the platform grows.",
			"Policies and service expectations can change when necessary to support users and platform health.",
			"Continued use of the service should align with the current platform rules and guidance.",
		],
	},
];

export default function TermsOfServicePage() {
	return (
		<FooterPageTemplate
			eyebrow="Support"
			title="Terms of Service"
			intro="These terms describe the expectations for using BookNest in a way that supports a safe, respectful, and reader-focused experience."
			sections={sections}
			note="Before public release, this page should be finalized with legally reviewed terms tailored to your real product behavior and moderation approach."
		/>
	);
}