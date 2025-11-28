import React from 'react';
import styles from '../styles/components/AnnouncementBanner.module.css';

const AnnouncementBanner = ({ storyName }) => {
  if (!storyName) {
    return null;
  }

  return (
    <div className={styles.bannerContainer}>
      <p className={styles.bannerText}>
        Estás viendo la historia de <strong>{storyName}</strong>. Explora sus secciones o navega por otras narrativas relacionadas utilizando las felchas de navegación.
      </p>
    </div>
  );
};

export default AnnouncementBanner;
