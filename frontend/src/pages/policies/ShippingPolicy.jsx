import PolicyPage from '../../components/PolicyPage';

const SECTIONS = [
  {
    heading: 'Shipping charges',
    paras: [
      'Orders above Rs.999 ship free. For smaller orders a flat shipping fee applies, and the exact amount is shown at checkout before you pay.',
    ],
  },
  {
    heading: 'Processing time',
    paras: ['We usually dispatch orders within 1 to 2 business days of receiving payment. Orders placed on Sundays or public holidays are processed on the next business day.'],
  },
  {
    heading: 'Delivery time',
    paras: [
      'Delivery usually takes 3 to 7 business days after dispatch, depending on your location and the courier. Remote locations and peak seasons can take longer.',
      'Milk and ghee are packed in sealed, food-safe packaging and dispatched as close to your delivery slot as possible.',
    ],
  },
  {
    heading: 'Order tracking',
    paras: ['After logging in, open "My Orders" to see the current status of every order you have placed. We also email order updates to the address on your account.'],
  },
  {
    heading: 'Delivery address',
    paras: [
      'Please enter a complete, correct address and a working phone number. We are not responsible for delays or failed deliveries caused by an incorrect or incomplete address. If a delivery fails because nobody was available to receive it, the courier may attempt it again or return the parcel to us; extra shipping costs may apply for re-delivery.',
    ],
  },
  {
    heading: 'Damaged or missing parcels',
    paras: [
      'Please check your parcel when it arrives. If it is damaged, leaking or incomplete, follow the steps in our Cancellation & Refund Policy as soon as possible.',
    ],
  },
  {
    heading: 'Contact us',
    paras: ['Questions about a delivery? Email Thevedikfarms@gmail.com or call +91 79771 04965 with your order number.'],
  },
];

export default function ShippingPolicy() {
  return <PolicyPage title="Shipping Policy" updated="October 2026" sections={SECTIONS} />;
}
