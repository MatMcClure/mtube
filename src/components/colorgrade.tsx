import { useRef, useState } from "react";
import "../styles/ColorGrade.css";


interface Props {
  src: string;
}

const ColorGradeReveal: React.FC<Props> = ({ src }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reveal, setReveal] = useState(0.3);
  const [dragging, setDragging] = useState(false);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const diagonal = Math.min(Math.max((x + y) / 2, 0), 1);
    setReveal(diagonal);
  };

  return (
    <div
      ref={containerRef}
      className="colorgrade-container"
      onMouseDown={() => setDragging(true)}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onMouseMove={handleMove}
    >
      {/* Desaturated base */}
      <img src={src} className="base-image" draggable={false} />

      {/* Revealed image */}
      <img
        src={src}
        className="reveal-image"
        draggable={false}
        style={{
          clipPath: `polygon(
            0% 0%,
            ${reveal * 100}% 0%,
            0% ${reveal * 100}%,
            0% 0%
          )`
        }}
      />
    </div>
  );
};

export default ColorGradeReveal;