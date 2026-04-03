import FooterPageTemplate from './FooterPageTemplate';

const sections = [
  {
    title: 'Built For Reading On The Move',
    description:
      'The mobile experience is meant to support readers who want quick access to books, lists, and updates wherever they are.',
    points: [
      'Check your saved books and reading progress from a phone-friendly interface.',
      'Continue browsing titles and categories without needing a desktop session.',
      'Make daily reading habits easier to maintain during travel, breaks, or commute time.',
    ],
  },
  {
    title: 'Simple And Fast Interaction',
    description:
      'Readers on mobile need less clutter and faster actions, so the experience should stay focused and clear.',
    points: [
      'Open key reader actions quickly, such as saving a title or returning to your current book list.',
      'Reduce friction for community engagement by making reviews and reactions easier to post.',
      'Keep layouts responsive so important content stays readable on smaller screens.',
    ],
  },
  {
    title: 'Connected Across Devices',
    description:
      'A strong mobile experience should feel like a continuation of the same reading journey, not a separate product.',
    points: [
      'Let readers move between desktop and mobile without losing context.',
      'Keep reading lists, preferences, and saved activity aligned across sessions.',
      'Support a consistent BookNest identity regardless of the screen size being used.',
    ],
  },
];

export default function MobileAppPage() {
  return (
    <FooterPageTemplate
      eyebrow="Product"
      title="Mobile App"
      intro="BookNest is being shaped to support reading habits beyond the desktop, with a mobile experience that stays quick, readable, and connected."
      sections={sections}
      note="If you plan to add a dedicated native mobile app later, this page can evolve into feature highlights, release notes, and app download information."
    />
  );
}
