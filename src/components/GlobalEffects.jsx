import { useData } from "../context/DataContext";
import BirdAnimation from "./BirdAnimation";

const GlobalEffects = () => {
    const { drawnFrames } = useData();

    if (!drawnFrames || drawnFrames.length === 0) return null;

    return <BirdAnimation frames={drawnFrames} />;
};

export default GlobalEffects;
