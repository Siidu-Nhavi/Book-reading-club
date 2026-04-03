import FooterPageTemplate from './FooterPageTemplate';

const sections = [
  {
    title: 'Our Story In Public',
    description:
      'The press page helps explain BookNest to media partners, education communities, and readers discovering the platform for the first time.',
    points: [
      'Present BookNest as a reading-first product built around discovery and community.',
      'Share the mission, purpose, and value the platform brings to readers.',
      'Make it easier for outside audiences to understand what the platform stands for.',
    ],
  },
  {
    title: 'Media And Interviews',
    description:
      'A dedicated press area also creates a clear point of contact for publication, interview, and platform coverage requests.',
    points: [
      'Support journalists who need a quick overview of the product and team.',
      'Provide a place for partnership and speaking inquiries related to reading culture.',
      'Keep communication organized for announcements, updates, and media mentions.',
    ],
  },
  {
    title: 'Brand And Partnership Use',
    description:
      'Press pages are also useful for collaborators who need a trustworthy summary of the platform before working together.',
    points: [
      'Help schools, reading groups, and literary partners understand the platform direction.',
      'Create room for future brand resources, statements, and official announcements.',
      'Build confidence with partners who want to see a consistent public message.',
    ],
  },
];

export default function PressPage() {
  return (
    <FooterPageTemplate
      eyebrow="Company"
      title="Press"
      intro="BookNest welcomes media attention and thoughtful partnerships that help more people discover the value of reading communities."
      sections={sections}
      note="Later, you can expand this page with downloadable media assets, announcements, and a direct press contact address."
    />
  );
}
