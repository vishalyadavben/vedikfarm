import PolicyPage from '../../components/PolicyPage';

const SECTIONS = [
  {
    heading: 'About these terms',
    paras: [
      'By using vedikfarm.in and placing an order, you agree to these terms. The website is operated by Vedik Farms, Mira Road, Mumbai, Maharashtra, India. If you do not agree, please do not use the website.',
    ],
  },
  {
    heading: 'Your account',
    paras: [
      'You need an account to place orders. Please give accurate details and keep your password private. You are responsible for activity on your account. We may suspend accounts that are used for fraud or misuse.',
    ],
  },
  {
    heading: 'Products and prices',
    list: [
      'Prices are shown in Indian Rupees (Rs.). Taxes such as GST are shown in the order summary where applicable.',
      'We take care to describe and photograph our products accurately, but packaging, colour and appearance can vary slightly. Natural products can differ between batches.',
      'Stock is limited. If an item becomes unavailable or a price was shown in error, we may cancel that item and refund any amount you have paid for it.',
    ],
  },
  {
    heading: 'Orders and payment',
    paras: [
      'Placing an order is an offer to buy. An order is confirmed once payment is received successfully. We accept online payments only (UPI, cards and net banking through Razorpay) and do not currently offer cash on delivery. Shipping charges, if any, are shown before you pay.',
    ],
  },
  {
    heading: 'Delivery, cancellations and refunds',
    paras: [
      'Delivery is covered by our Shipping Policy, and cancellations, returns and refunds by our Cancellation & Refund Policy. Both form part of these terms.',
    ],
  },
  {
    heading: 'Dietician consultation',
    paras: [
      'The free dietician consultation offered through "My Dietician Plan" is for general nutrition guidance only. It is not medical advice, diagnosis or treatment, and it does not replace consulting your doctor, especially if you have a health condition, are pregnant, or take medication. The offer is subject to availability and we may change or withdraw it at any time.',
    ],
  },
  {
    heading: 'Health and product information',
    paras: [
      'Information on this website, including health-concern categories and product descriptions, is general and informational. It is not a claim that any product treats, cures or prevents any disease. Please check ingredients for allergens before use.',
    ],
  },
  {
    heading: 'Intellectual property',
    paras: [
      'The website\'s design, text, images, logos and software are owned by or licensed to Vedik Farms and its licensors. You may not copy, reproduce or reuse them without written permission, except for your own personal, non-commercial use of the site.',
    ],
  },
  {
    heading: 'Acceptable use',
    paras: [
      'Please do not misuse the website: no attempts to break into it, disrupt it, scrape it at scale, submit false orders or reviews, or use it for anything unlawful.',
    ],
  },
  {
    heading: 'Limitation of liability',
    paras: [
      'To the fullest extent permitted by law, Vedik Farms is not liable for indirect or consequential losses arising from use of the website or products. Our total liability for any claim relating to an order is limited to the amount you paid for that order. Nothing here limits any right you have under applicable consumer protection law.',
    ],
  },
  {
    heading: 'Governing law',
    paras: [
      'These terms are governed by the laws of India. Courts in Mumbai, Maharashtra, have jurisdiction over any dispute, subject to any rights you have under consumer protection law.',
    ],
  },
  {
    heading: 'Changes and contact',
    paras: [
      'We may update these terms from time to time; the date above shows the latest version. Questions? Email Thevedikfarms@gmail.com or call +91 79771 04965.',
    ],
  },
];

export default function TermsAndConditions() {
  return <PolicyPage title="Terms & Conditions" updated="October 2026" sections={SECTIONS} />;
}
