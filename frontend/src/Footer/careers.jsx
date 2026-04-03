import FooterPageTemplate from './FooterPageTemplate';

const sections = [
  {
    title: 'Mission-Driven Work',
    description:
      'Careers at BookNest are centered on building a product that supports learning, conversation, and the culture of reading.',
    points: [
      'Contribute to a platform that helps people read more intentionally and more often.',
      'Work on features that affect real readers, clubs, and growing communities.',
      'Be part of a product direction that values usefulness over noise.',
    ],
  },
  {
    title: 'How We Work',
    description:
      'The strongest teams usually combine collaboration, ownership, and steady improvement, and that is the kind of environment BookNest aims to grow.',
    points: [
      'Value thoughtful problem-solving and reader-first decisions.',
      'Encourage teamwork, clear communication, and practical execution.',
      'Create room for people who learn fast and care about meaningful digital experiences.',
    ],
  },
  {
    title: 'Future Opportunities',
    description:
      'As BookNest expands, the range of roles can grow across product, design, community, and engineering.',
    points: [
      'Support future hiring needs around platform growth and user experience.',
      'Open the door for contributors who are passionate about education, books, and technology.',
      'Make space for talent that wants to build something useful from the ground up.',
    ],
  },
];

export default function CareersPage() {
  return (
    <FooterPageTemplate
      eyebrow="Company"
      title="Careers"
      intro="BookNest is interested in people who care about good products, strong communities, and the long-term value of reading."
      sections={sections}
      note="When you are ready, this page can also include open positions, role expectations, and the application process."
    />
  );
}
