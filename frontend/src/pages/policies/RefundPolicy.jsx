import PolicyPage from '../../components/PolicyPage';

const SECTIONS = [
  {
    heading: 'Cancelling an order',
    paras: [
      'You can cancel an order before it has been dispatched for a full refund. Contact us as soon as possible with your order number. Once an order has been dispatched it can no longer be cancelled.',
    ],
  },
  {
    heading: 'Returns',
    paras: [
      'Because our products are food items, many of them perishable, we cannot accept returns once an order has been delivered, for hygiene and food-safety reasons. This does not affect your rights if something is wrong with your order, as described below.',
    ],
  },
  {
    heading: 'Damaged, wrong or spoiled items',
    paras: ['If your order arrives damaged, leaking, spoiled, or with a wrong or missing item, please tell us within 48 hours of delivery and include:'],
    list: [
      'Your order number.',
      'Clear photos of the product and its packaging, and the outer parcel if it was damaged.',
      'A short description of the problem.',
    ],
  },
  {
    heading: 'What we will do',
    paras: [
      'After checking your report, we will send a replacement or refund the affected item(s), whichever you prefer where stock allows. We may ask for more information to verify the issue.',
    ],
  },
  {
    heading: 'How refunds are paid',
    paras: [
      'Approved refunds go back to the original payment method (the same UPI, card or bank account you paid with). They usually reach you within 5 to 7 business days of approval, depending on your bank.',
    ],
  },
  {
    heading: 'Failed or double payments',
    paras: [
      'If money was debited but your order was not confirmed, or you were charged twice, the amount is normally returned automatically by your bank or payment provider within a few business days. If it is not, contact us with your payment details and we will help.',
    ],
  },
  {
    heading: 'Contact us',
    paras: ['To cancel an order or report a problem, email Thevedikfarms@gmail.com or call +91 79771 04965.'],
  },
];

export default function RefundPolicy() {
  return <PolicyPage title="Cancellation & Refund Policy" updated="October 2026" sections={SECTIONS} />;
}
