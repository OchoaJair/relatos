import styles from "../styles/components/Waves.module.css";

const Waves = ({ count = 3 }) => {
  const waves = Array.from({ length: count }, (_, i) => i);
  const colors = ["#3a8fd9", "#2d7dc5", "#4a9de3", "#1a73b8", "#5cadf0"];

  return (
    <div className={styles.container}>
      <svg
        className={styles.svg}
        viewBox="0 0 1000 120"
        preserveAspectRatio="none"
      >
        {waves.map((_, index) => (
          <path
            key={index}
            className={styles.wave}
            d="M0,60 C150,15 300,105 450,60 C600,15 750,105 900,60 C1050,15 1200,105 1350,60"
            style={{
              stroke: colors[index % colors.length],
              strokeWidth: 1 + index * 0.5,
              opacity: 0.8 - index * 0.2,
              animationDelay: `${index * 1}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export default Waves;
