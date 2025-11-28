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
  const [selectedItems, setSelectedItems] = useState(() => {
    const savedSelectedItems = localStorage.getItem("selectedItems");
    return savedSelectedItems ? JSON.parse(savedSelectedItems) : [];
  }); // Estado para los elementos seleccionados
  const [selectedViolenceIds, setSelectedViolenceIds] = useState(() => {
    const savedSelectedViolenceIds = localStorage.getItem("selectedViolenceIds");
    return savedSelectedViolenceIds ? JSON.parse(savedSelectedViolenceIds) : [];
  }); // Estado para las violencias seleccionadas
  const [violenceSlugs, setViolenceSlugs] = useState(() => {
    const savedViolenceSlugs = localStorage.getItem("violenceSlugs");
    return savedViolenceSlugs ? JSON.parse(savedViolenceSlugs) : [];
  }); // Estado para almacenar los slugs basados en las violencias seleccionadas

  const setSelectedItemsInContext = (items) => {
    setSelectedItems(items); // Actualiza los elementos seleccionados
    localStorage.setItem("selectedItems", JSON.stringify(items));
  };

  const setSelectedViolenceInContext = (violenceIds) => {
    setSelectedViolenceIds(violenceIds);
    localStorage.setItem("selectedViolenceIds", JSON.stringify(violenceIds));
    
    // Calcular los slugs basados en la intersección de todas las violencias seleccionadas
    if (violenceIds && violenceIds.length > 0) {
      const slugs = data.filter(item => 
        item.violencia && 
        violenceIds.every(violenceId => item.violencia.includes(violenceId))
      ).map(item => item.slug);
      
      setViolenceSlugs(slugs);
      localStorage.setItem("violenceSlugs", JSON.stringify(slugs));
      console.log(`Slugs para la intersección de violencias ID [${violenceIds.join(', ')}]:`, slugs);
    } else {
      // Si no hay violencias seleccionadas, limpiar los slugs
      setViolenceSlugs([]);
      localStorage.setItem("violenceSlugs", JSON.stringify([]));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/data.json");
        const projects = await response.json();
        const images = projects.map((project) => project.featured);
        setImgs(images);
        setData(projects);
        localStorage.setItem("data", JSON.stringify(projects));
        localStorage.setItem("imgs", JSON.stringify(images));
        
        // Si ya había violencias seleccionadas, recalcular los slugs con los nuevos datos
        if (selectedViolenceIds.length > 0) {
          const slugs = projects.filter(item => 
            item.violencia && 
            selectedViolenceIds.every(violenceId => item.violencia.includes(violenceId))
          ).map(item => item.slug);
          
          setViolenceSlugs(slugs);
          localStorage.setItem("violenceSlugs", JSON.stringify(slugs));
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchExtraData = async () => {
      try {
        const response = await fetch("/data/extraData.json");
        const extra = await response.json();
        setExtraData(extra);
        localStorage.setItem("extraData", JSON.stringify(extra));
      } catch (error) {
        console.log(error);
      }
    };

    if (!data.length) fetchData();
    if (!extraData.length) fetchExtraData();
  }, [data.length, extraData.length, selectedViolenceIds]);

  return (
    <DataContext.Provider
      value={{
        data,
        imgs,
        extraData,
        selectedItems,
        setSelectedItemsInContext,
        selectedViolence: selectedViolenceIds, // Mantener nombre original para compatibilidad
        setSelectedViolenceInContext,
        violenceSlugs,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
