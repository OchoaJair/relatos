import React, { useEffect, useRef } from 'react';
import styles from '../styles/components/TimelineTabs.module.css';

const TimelineTabs = ({ stories, activeStory, onStoryClick, groupName }) => {

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
      <div className={styles.timelineContainer} ref={timelineContainerRef} id="selected-shorts">
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
              {index < stories.length - 1 && <div className={styles.line} />}
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
