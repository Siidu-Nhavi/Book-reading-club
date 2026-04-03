import FooterPageTemplate from './FooterPageTemplate';

const sections = [
  {
    title: 'Getting Started',
    description:
      'A help center should make the first steps inside BookNest clear, especially for readers who are joining a new platform.',
    points: [
      'Explain how to browse books, discover categories, and start building a personal reading list.',
      'Guide users through account basics so they can settle in quickly.',
      'Reduce early confusion by answering the most common first-time questions.',
    ],
  },
  {
    title: 'Using Core Features',
    description:
      'Readers often need quick guidance on how to use the main tools that keep the platform useful day after day.',
    points: [
      'Show how reading progress, saved books, and community features are meant to work.',
      'Help readers understand where to find key actions and updates.',
      'Keep explanations practical so users can solve problems without extra back-and-forth.',
    ],
  },
  {
    title: 'Ongoing Reader Support',
    description:
      'The help center should continue supporting users after signup, especially when new features are added over time.',
    points: [
      'Answer repeat questions in one organized place so support stays scalable.',
      'Make it easier for readers to resolve issues before they become frustrating.',
      'Create a self-service knowledge area that grows with the platform.',
    ],
  },
];

export default function HelpCenterPage() {
  return (
    <FooterPageTemplate
      eyebrow="Support"
      title="Help Center"
      intro="The Help Center is where BookNest explains the platform clearly, solves common user problems, and supports readers at every stage of their journey."
      sections={sections}
      note="This page can later be expanded into searchable help articles, setup guides, and FAQ categories tied to real support needs."
    />
  );
}
