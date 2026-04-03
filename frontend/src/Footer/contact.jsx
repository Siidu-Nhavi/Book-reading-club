import FooterPageTemplate from './FooterPageTemplate';

const sections = [
  {
    title: 'General Support',
    description:
      'Readers should always have a simple path to ask questions and get clarity about the platform.',
    points: [
      'Use this space for account help, platform guidance, and everyday support questions.',
      'Make it clear that BookNest is open to hearing from both new and returning readers.',
      'Keep communication direct and welcoming so users feel comfortable reaching out.',
    ],
  },
  {
    title: 'Feedback And Suggestions',
    description:
      'Strong reading platforms improve fastest when they stay connected to the people actually using them.',
    points: [
      'Invite feature requests that help shape better reading and community tools.',
      'Encourage honest feedback about what feels helpful, confusing, or missing.',
      'Show that product improvement is part of an ongoing conversation with users.',
    ],
  },
  {
    title: 'Partnership Conversations',
    description:
      'BookNest can also use the contact page to connect with schools, clubs, educators, and reading communities.',
    points: [
      'Open the door for event ideas, reading initiatives, and collaboration opportunities.',
      'Support community organizers who want to use BookNest in a structured way.',
      'Create a clear starting point for organizations interested in working together.',
    ],
  },
];

export default function ContactPage() {
  return (
    <FooterPageTemplate
      eyebrow="Company"
      title="Contact"
      intro="Whether you have a question, a suggestion, or an idea for collaboration, BookNest is meant to stay approachable and easy to reach."
      sections={sections}
      note="When you add real contact details later, this page can include email, support hours, social links, and a working contact form."
    />
  );
}
