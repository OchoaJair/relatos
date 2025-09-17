import { createContext, useContext, useState, useEffect } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem("data");
    return savedData ? JSON.parse(savedData) : [];
  });
  const [imgs, setImgs] = useState(() => {
    const savedImgs = localStorage.getItem("imgs");
    return savedImgs ? JSON.parse(savedImgs) : [];
  });
  const [extraData, setExtraData] = useState(() => {
    const savedExtraData = localStorage.getItem("extraData");
    return savedExtraData ? JSON.parse(savedExtraData) : [];
  });
  const [selectedItems, setSelectedItems] = useState([]); // Estado para los elementos seleccionados

  const setSelectedItemsInContext = (items) => {
    setSelectedItems(items); // Actualiza los elementos seleccionados
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.relatosdereconciliacion.com/wp-json/relatos/v1/get-all-projects"
        );
        const projects = await response.json();
        const images = projects.map((project) => project.featured);
        setImgs(images);
        setData(projects);
        localStorage.setItem("data", JSON.stringify(projects));
        localStorage.setItem("imgs", JSON.stringify(images));
      } catch (error) {
        console.log(error);
      }
    };

    const fetchExtraData = async () => {
      try {
        const response = await fetch(
          "https://api.relatosdereconciliacion.com/wp-json/relatos/v1/get-taxonomies"
        );
        const extra = await response.json();
        setExtraData(extra);
        localStorage.setItem("extraData", JSON.stringify(extra));
      } catch (error) {
        console.log(error);
      }
    };

    if (!data.length) fetchData();
    if (!extraData.length) fetchExtraData();
  }, [data.length, extraData.length]);

  return (
    <DataContext.Provider
      value={{
        data,
        imgs,
        extraData,
        selectedItems,
        setSelectedItemsInContext,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
