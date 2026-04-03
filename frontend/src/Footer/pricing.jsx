import FooterPageTemplate from './FooterPageTemplate';

const sections = [
  {
    title: 'Accessible For Every Reader',
    description:
      'BookNest is planned around simple access so readers can explore the platform without friction.',
    points: [
      'Support a free starting point for readers who want to browse and participate casually.',
      'Keep the experience easy to understand without complex billing language or confusing upgrades.',
      'Make it possible for readers to begin small and expand their usage over time.',
    ],
  },
  {
    title: 'Value Beyond Basic Access',
    description:
      'As the platform grows, pricing can support deeper engagement for readers who want more tools and personalization.',
    points: [
      'Offer enhanced reading tools, saved preferences, and richer progress experiences for active readers.',
      'Create upgrade paths for communities that need shared features and stronger collaboration.',
      'Focus every paid step on added reading value instead of locking the core experience behind barriers.',
    ],
  },
  {
    title: 'Flexible Growth For Clubs',
    description:
      'Reading clubs and communities often need features that scale with member participation and shared activity.',
    points: [
      'Support group-based experiences such as club spaces, reading events, and guided challenges.',
      'Keep pricing flexible enough for growing communities rather than forcing one rigid plan.',
      'Make future plan structures understandable for both individuals and organizer-led groups.',
    ],
  },
];

export default function PricingPage() {
  return (
    <FooterPageTemplate
      eyebrow="Product"
      title="Pricing"
      intro="BookNest pricing is intended to stay simple, reader-friendly, and flexible enough for both individual readers and larger communities."
      sections={sections}
      note="When pricing options are finalized, this page can be expanded with exact plan names, feature comparisons, and payment details."
    />
  );
}
