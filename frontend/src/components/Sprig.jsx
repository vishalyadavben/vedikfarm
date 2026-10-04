import wheat from '../assets/sprigs/sprig-wheat.webp';
import mango from '../assets/sprigs/sprig-mango.webp';
import rice from '../assets/sprigs/sprig-rice.webp';
import grass from '../assets/sprigs/sprig-grass.webp';

const SRC = { wheat, mango, rice, grass };

/**
 * Decorative watercolour illustration tucked into the edge of a section (purely cosmetic).
 * Put it inside an element with the "sprig-host" class. It sits at the browser edge, behind the content.
 *   name: wheat | mango | rice | grass      side: 'left' | 'right'   (left versions are mirrored)
 */
export default function Sprig({ name, side = 'right', className = '' }) {
  return (
    <img
      src={SRC[name]}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      className={`sprig sprig-${name} sprig-${side} ${className}`}
    />
  );
}
