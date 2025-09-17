import style from "../styles/components/Button.module.css";
import { useNavigate } from "react-router-dom";

export default function Button(props) {
  const text = props.text || "Button";
  const url = props.url || "";
  const data = props.data || {};
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/" + url, { state: { datos: data } })}
      className={style.button}
    >
      {text}
    </button>
  );
}
