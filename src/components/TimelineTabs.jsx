import React from 'react';
import styles from '../styles/components/TimelineTabs.module.css';

const TimelineTabs = ({ stories, displayedStory, groupName }) => {
  if (!stories || stories.length <= 1) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <h4 className={styles.title}>
        {groupName ? `Historias en el grupo: ${groupName}` : 'Historias en este grupo:'}
      </h4>
      <div className={styles.tabsContainer}>
        {stories.map((story) => (
          <div
            key={story.slug}
            className={`${styles.tabItem} ${
              story.slug === displayedStory.slug ? styles.active : ''
            }`}
          >
            {story.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineTabs;
