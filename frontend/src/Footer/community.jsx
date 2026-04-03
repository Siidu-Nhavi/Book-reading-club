import FooterPageTemplate from './FooterPageTemplate';

const sections = [
  {
    title: 'Readers Belong Together',
    description:
      'BookNest treats community as a core part of the reading experience rather than a side feature.',
    points: [
      'Give readers space to share thoughts, reactions, and recommendations around books.',
      'Make reading feel more social and less isolated without losing focus on the books themselves.',
      'Create a welcoming place where different reading styles and interests can meet.',
    ],
  },
  {
    title: 'Conversation That Adds Value',
    description:
      'A strong reading community should help readers discover better books and think more deeply about what they read.',
    points: [
      'Support book discussions that go beyond star ratings and short comments.',
      'Encourage thoughtful recommendations from people with shared interests.',
      'Use community interaction to improve discovery in a natural way.',
    ],
  },
  {
    title: 'Shared Reading Momentum',
    description:
      'People often read more consistently when they feel connected to others who are reading alongside them.',
    points: [
      'Create room for reading challenges, group goals, and club-based participation.',
      'Help members stay motivated through visible progress and community activity.',
      'Turn reading into a habit supported by connection and shared accountability.',
    ],
  },
];

export default function CommunityPage() {
  return (
    <FooterPageTemplate
      eyebrow="Support"
      title="Community"
      intro="The BookNest community is built to help readers discover, discuss, and stay motivated together through books."
      sections={sections}
      note="As community features grow, this page can include reading events, spotlight groups, challenge calendars, and reader-led spaces."
    />
  );
}
