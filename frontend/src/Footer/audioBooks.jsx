import FooterPageTemplate from './FooterPageTemplate';

const sections = [
  {
    title: 'Reading In Multiple Formats',
    description:
      'BookNest aims to serve readers with different habits, including people who prefer to listen instead of reading every page visually.',
    points: [
      'Support discovery for books that work well in listening-focused formats.',
      'Make the reading journey more flexible for users with busy schedules.',
      'Help members stay connected to stories and ideas even when they are away from a desk.',
    ],
  },
  {
    title: 'A Better Everyday Fit',
    description:
      'Audio-focused reading can help readers keep learning and enjoying books during everyday routines.',
    points: [
      'Fit reading time into commutes, exercise, chores, and short breaks.',
      'Open the platform to users who enjoy listening while multitasking.',
      'Expand accessibility for people who prefer a more audio-driven content experience.',
    ],
  },
  {
    title: 'Future Listening Experience',
    description:
      'As BookNest grows, audio book support can become part of a broader and more flexible reading ecosystem.',
    points: [
      'Combine listening options with saved libraries, recommendations, and community feedback.',
      'Help readers switch between discovery, discussion, and listening in one place.',
      'Keep the platform ready for richer format support as reader expectations evolve.',
    ],
  },
];

export default function AudioBooksPage() {
  return (
    <FooterPageTemplate
      eyebrow="Product"
      title="Audio Books"
      intro="BookNest sees audio books as an important part of modern reading habits, giving readers another way to stay engaged with stories and ideas."
      sections={sections}
      note="This page can later expand into a full audio experience area with featured titles, listening categories, and format-specific recommendations."
    />
  );
}
