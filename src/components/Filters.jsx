import { useData } from "../context/DataContext";
import { useState, useEffect } from "react";
import styles from "../styles/components/Filters.module.css";

function Filters() {
  const { extraData, setSelectedItemsInContext, setSelectedViolenceInContext } = useData();
  const [selectedItem, setSelectedItem] = useState([]);

  const colors = ["#57aed2", "#2888d6", "#2d9696", "#24a1e6", "#4d5bd6"];

  const handleItemClick = (item) => {
    const isItemSelected = selectedItem.some((selected) => selected === item);

    let newSelectedItem;
    if (isItemSelected) {
      newSelectedItem = selectedItem.filter((selected) => selected !== item);
    } else {
      newSelectedItem = [...selectedItem, item];
    }

    setSelectedItem(newSelectedItem);

    // Verificar si el ítem es una violencia (buscando en extraData.violencia)
    const isViolence = extraData.violencia && extraData.violencia.some(v => v.id === item);

    // Actualizar las violencias seleccionadas basándose en todas las selecciones actuales
    const currentViolences = newSelectedItem.filter(selected =>
      extraData.violencia && extraData.violencia.some(v => v.id === selected)
    );

    setSelectedViolenceInContext(currentViolences);
  };

  const handleResetFilters = () => {
    setSelectedItem([]); // Limpia la selección
    setSelectedViolenceInContext([]); // Limpia las violencias seleccionadas
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
      <p className={styles.explanation}>
        Para que tu largometraje se vuelva interactivo debes seleccionar:
      </p>
      <div className={styles.filtersSection}>
        <p className={styles.sectionHeader}>1. Tipo de violencia</p>
        <ul className={styles.navList}>
          <li
            onClick={() => handleResetFilters()}
            className={`${styles.navListItem} ${selectedItem.length === 0 ? styles.selected : ""
              }`}
            style={
              selectedItem.length === 0
                ? { backgroundColor: "#2d9696" } // Color por defecto para "Todos"
                : {}
            }
          >
            Todos
          </li>
          {extraData.violencia.map((item, index) => {
            const active = isSelected(item.id);
            const activeColor = colors[index % colors.length];

            return (
              <li
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`${styles.navListItem} ${active ? styles.selected : ""}`}
                style={active ? { backgroundColor: activeColor } : {}}
              >
                {item.name}
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.filtersSection}>
        <p className={styles.sectionHeader}>2. Técnica de animación</p>

        <ul className={styles.navList}>
          {extraData.tecnicas.map((item, index) => {
            const active = isSelected(item.id);
            const activeColor = colors[(index + 3) % colors.length];

            return (
              <li
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`${styles.techniqueItem} ${active ? styles.selected : ""}`}
                style={active ? { backgroundColor: activeColor } : {}}
              >
                {item.name}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export default Filters;
