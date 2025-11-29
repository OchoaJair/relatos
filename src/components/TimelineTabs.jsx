import React, { useEffect, useRef } from 'react';
import styles from '../styles/components/TimelineTabs.module.css';

const TimelineTabs = ({ stories, activeStory, onStoryClick, groupName }) => {
  console.log(history);
  if (!stories || stories.length === 0) {
    return null;
  }

  const activeIndex = activeStory ? stories.findIndex(story => story.slug === activeStory.slug) : -1;
  const activeStepRef = useRef(null);
  const timelineContainerRef = useRef(null);

  useEffect(() => {
    if (activeStepRef.current) {
      activeStepRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeIndex]);

  const getStepClass = (index) => {
    if (index < activeIndex) return styles.past;
    if (index === activeIndex) return styles.active;
    return styles.future;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h4 className={styles.mainTitle}>
          {groupName ? `Línea de tiempo: ${groupName}` : 'Línea de tiempo del relato'}
        </h4>
        {activeIndex !== -1 && (
          <p className={styles.subtitle}>
            Capítulo {activeIndex + 1} de {stories.length}: {stories[activeIndex].title}
          </p>
        )}
      </div>
      <div className={styles.timelineContainer} ref={timelineContainerRef}>
        {stories.map((story, index) => (
          <div
            key={story.slug}
            className={`${styles.step} ${getStepClass(index)}`}
            ref={index === activeIndex ? activeStepRef : null}
          >
            <div className={styles.nodeContainer}>
              <button
                className={styles.node}
                onClick={() => onStoryClick(story)}
                aria-label={`Ir a la historia: ${story.title}`}
              />
              {index === activeIndex && (
                <span className={styles.statusLabel}>Estás aquí</span>
              )}
            </div>
            <span className={styles.title}>{story.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineTabs;
