import { useData } from "../context/DataContext";
import { useState, useEffect } from "react";
import styles from "../styles/components/Filters.module.css";

function Filters() {
  const { extraData, setSelectedItemsInContext } = useData();
  const [selectedItem, setSelectedItem] = useState([]);

  const colors = ["#57aed2", "#2888d6", "#2d9696", "#24a1e6", "#4d5bd6"];

  const handleItemClick = (item) => {
    const isItemSelected = selectedItem.some((selected) => selected === item);

    if (isItemSelected) {
      setSelectedItem(selectedItem.filter((selected) => selected !== item));
    } else {
      setSelectedItem([...selectedItem, item]);
    }
  };

  const handleResetFilters = () => {
    setSelectedItem([]); // Limpia la selección
  };

  useEffect(() => {
    setSelectedItemsInContext(selectedItem);
  }, [selectedItem, setSelectedItemsInContext]);

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const isSelected = (id) => selectedItem.includes(id);

  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        <li
          onClick={() => handleResetFilters()}
          className={styles.navListItem}
          style={{ borderBottomColor: getRandomColor() }}
        >
          Todos
        </li>
        {extraData.violencia.map((item) => (
          <li
            onClick={() => handleItemClick(item.id)}
            className={`${styles.navListItem} ${
              isSelected(item.id) ? styles.selected : ""
            }`}
            key={item.id}
            style={{ borderBottomColor: getRandomColor() }}
          >
            {item.name}
          </li>
        ))}
      </ul>
      <ul className={styles.navList}>
        {extraData.tecnicas.map((item) => (
          <li
            onClick={() => handleItemClick(item.id)}
            className={`${styles.navListItem} ${
              isSelected(item.id) ? styles.selected : ""
            }`}
            key={item.id}
            style={{ borderBottomColor: getRandomColor() }}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Filters;
