import FooterPageTemplate from "./shared/FooterPageTemplate";

const sections = [
	{
		title: "Discovery That Feels Personal",
		description:
			"BookNest is designed to help readers find the right book faster instead of endlessly scrolling through generic lists.",
		points: [
			"Browse titles by genre, reading mood, author style, and reader interest.",
			"Highlight trending books, editor picks, and community favorites in one place.",
			"Make discovery feel curated, not random, for both new readers and regular members.",
		],
	},
	{
		title: "Reading Journey Support",
		description:
			"The platform focuses on keeping readers engaged after the first click by giving them a clearer reading path.",
		points: [
			"Track books you want to read, are currently reading, and have already completed.",
			"Set reading goals that encourage consistency without making the experience feel heavy.",
			"Keep a simple personal library so important titles stay organized and easy to revisit.",
		],
	},
	{
		title: "Community-Led Experience",
		description:
			"BookNest is not only about titles on a shelf. It is also about people, conversation, and shared reading habits.",
		points: [
			"Create space for reader reviews, ratings, and thoughtful discussion around books.",
			"Support book clubs, group challenges, and themed community activities.",
			"Encourage readers to discover books through other readers, not only through algorithms.",
		],
	},
];

export default function FeaturesPage() {
	return (
		<FooterPageTemplate
			eyebrow="Product"
			title="Features"
			intro="BookNest brings discovery, progress tracking, and reader connection together in one place so reading feels easier to start and more rewarding to continue."
			sections={sections}
			note="If you want to learn how these features fit together inside the platform, the BookNest team can walk you through the product vision and future roadmap."
		/>
	);
}