import FooterPageTemplate from './FooterPageTemplate';

const sections = [
  {
    title: 'Information We Collect',
    description:
      'BookNest may collect the information needed to support accounts, personalize the experience, and keep the platform functioning properly.',
    points: [
      'Account details such as name, email, and profile information shared during signup.',
      'Usage activity such as saved books, reading preferences, and interaction history.',
      'Technical information that helps maintain security, performance, and platform reliability.',
    ],
  },
  {
    title: 'How Information Is Used',
    description:
      'Collected information is used to improve reader experience, support account access, and guide product decisions.',
    points: [
      'Personalize recommendations, reading activity, and user-facing content where appropriate.',
      'Respond to support requests and protect the platform from misuse or security issues.',
      'Understand how readers use BookNest so the experience can improve over time.',
    ],
  },
  {
    title: 'Your Privacy Choices',
    description:
      'Readers should understand that their information matters and that privacy decisions deserve clear communication.',
    points: [
      'Users can review their shared account information and request support when needed.',
      'Sensitive information should be handled carefully and accessed only when necessary.',
      'Policy updates should be communicated clearly when privacy practices evolve.',
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <FooterPageTemplate
      eyebrow="Support"
      title="Privacy Policy"
      intro="BookNest respects reader privacy and aims to handle personal information responsibly, transparently, and with reasonable care."
      sections={sections}
      note="This is a strong foundation page for now. Before production launch, you should replace it with a final policy reviewed for your exact data practices and legal requirements."
    />
  );
}
