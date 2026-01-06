import { useEffect, useRef, useState } from "react";
import colorgradeImg from "../images/colorgradeimg.png";
import ColorGradeReveal from "../components/colorgrade";
import "../styles/Home.css";

const CameraSettingsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return; // ✅ TS-safe guard
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`camera-settings-section ${visible ? "show" : ""}`}
    >
      <h1>Camera Settings</h1>
      <ColorGradeReveal src={colorgradeImg} />
    </section>
  );
};

export default CameraSettingsSection;
