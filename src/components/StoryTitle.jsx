import React from 'react';
import styles from '../styles/components/StoryTitle.module.css';

const StoryTitle = ({ stories, activeStory, groupName }) => {
    if (!stories || stories.length === 0 || !activeStory) {
        return null;
    }

    const activeIndex = stories.findIndex(story => story.slug === activeStory.slug);

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
        </div>
    );
};

export default StoryTitle;
