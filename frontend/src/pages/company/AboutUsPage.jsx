import FooterPageTemplate from "../shared/FooterPageTemplate";

const sections = [
	{
		title: "Why BookNest Exists",
		description:
			"BookNest was imagined as a place where reading becomes easier to sustain and more enjoyable to share.",
		points: [
			"Bring readers together around discovery, discussion, and long-term reading habits.",
			"Create a digital space that feels welcoming to both new readers and experienced book lovers.",
			"Encourage meaningful engagement with books instead of passive content browsing.",
		],
	},
	{
		title: "What We Care About",
		description:
			"The platform is built around values that help reading communities feel active, supportive, and useful.",
		points: [
			"Curiosity that leads people to discover new perspectives and ideas.",
			"Community that turns reading into something shared rather than isolated.",
			"Consistency that helps readers build sustainable habits over time.",
		],
	},
	{
		title: "Who We Build For",
		description:
			"BookNest is shaped for a wide range of users who want books to stay part of everyday life.",
		points: [
			"Students looking for better reading structure and discovery.",
			"Casual readers who want a simple and motivating platform.",
			"Reading clubs and communities that want a stronger shared experience.",
		],
	},
];

export default function AboutUsPage() {
	return (
		<FooterPageTemplate
			eyebrow="Company"
			title="About Us"
			intro="BookNest is built around one clear idea: reading grows stronger when discovery, community, and consistency all work together."
			sections={sections}
			note="As your platform story becomes more defined, this page can also include founder background, milestone history, and community impact."
		/>
	);
}