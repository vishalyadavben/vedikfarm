import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div>
      <h1>Page Not Found</h1>
      <p><Link to="/">Go back home</Link></p>
    </div>
  );
}
