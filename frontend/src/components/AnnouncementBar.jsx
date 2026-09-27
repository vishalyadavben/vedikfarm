// Single source of truth for the free-shipping threshold shown in the announcement bar.
// If you change SHIPPING_FREE_ABOVE in the backend .env, update this to match.
const FREE_SHIPPING_THRESHOLD = 999;

export default function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      <p>
        Free shipping on orders above Rs.{FREE_SHIPPING_THRESHOLD} &middot; 100% A2 Gir Cow Milk, direct from the farm
      </p>
    </div>
  );
}
