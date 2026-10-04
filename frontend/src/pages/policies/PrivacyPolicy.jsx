import PolicyPage from '../../components/PolicyPage';

const SECTIONS = [
  {
    heading: 'Who we are',
    paras: [
      'This website, vedikfarm.in, is run by Vedik Farms, Shop No. Ground Floor, Next to Ram Mandir, Ramdev Park, Mira Road - 401107, Mumbai, Maharashtra, India. In this policy "we", "us" and "our" mean Vedik Farms.',
    ],
  },
  {
    heading: 'Information we collect',
    list: [
      'Account details: your name, email address, phone number and password (stored only in encrypted form).',
      'Order and delivery details: delivery addresses, the items you order, and your GSTIN if you provide one for an invoice.',
      'Dietician plan details, if you use "My Dietician Plan": your name, contact number, date of birth, height and any health condition you choose to tell us about. You decide what to share, and it is used only to arrange your consultation.',
      'Reviews and feedback you choose to submit.',
      'Basic technical information needed to run the site, such as a login token kept in your browser so you stay signed in.',
    ],
  },
  {
    heading: 'How we use your information',
    list: [
      'To process and deliver your orders, and send order confirmations and updates.',
      'To contact you about your order, your consultation request, or a question you have asked.',
      'To issue invoices, keep tax and accounting records, and meet legal obligations.',
      'To keep the website secure and prevent fraud or misuse.',
    ],
  },
  {
    heading: 'Payments',
    paras: [
      'Payments are processed by Razorpay. Your card, UPI or net banking details are entered on Razorpay\'s secure payment page and are never stored on our servers. Razorpay handles that information under its own privacy policy.',
    ],
  },
  {
    heading: 'Who we share information with',
    paras: [
      'We do not sell your personal information. We share it only with service providers who help us run the business, for example payment processing, courier and delivery partners, and email delivery, and only what they need to do their job. We may also disclose information when the law requires it.',
    ],
  },
  {
    heading: 'How long we keep it',
    paras: [
      'We keep your information for as long as your account is active and as long as needed for orders, invoicing, tax and legal records. You can ask us to delete your account and personal details, subject to records we are required by law to retain.',
    ],
  },
  {
    heading: 'Your choices and rights',
    paras: [
      'You can view your orders and update your saved addresses and password after logging in. You can also write to us to access, correct or delete the personal information we hold about you, or to withdraw consent for its use, using the contact details below.',
    ],
  },
  {
    heading: 'Security',
    paras: [
      'We use reasonable technical and organisational measures to protect your information, including encrypted connections (HTTPS) and hashed passwords. No online service can guarantee absolute security, so please keep your password private.',
    ],
  },
  {
    heading: 'Children',
    paras: ['Our website is meant for adults. We do not knowingly collect personal information from children.'],
  },
  {
    heading: 'Changes to this policy',
    paras: ['We may update this policy from time to time. The date at the top shows when it was last changed.'],
  },
  {
    heading: 'Contact us',
    paras: [
      'For any privacy question or request, email Thevedikfarms@gmail.com or call +91 79771 04965.',
    ],
  },
];

export default function PrivacyPolicy() {
  return <PolicyPage title="Privacy Policy" updated="October 2026" sections={SECTIONS} />;
}
