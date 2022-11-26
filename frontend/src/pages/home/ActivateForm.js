import PropagateLoader from "react-spinners/PropagateLoader";
import { Link } from "react-router-dom";
export default function ActivateForm({ type, header, text, loading }) {
  return (
    <div className="blur1">
      <div className="popup">
        <div
          className={`popup_header ${
            type === "success" ? "success_text" : "error_text"
          }`}
        >
          {header}
        </div>
        <div className="popup_message">{text}</div>
        <PropagateLoader color="#1876f2" loading={loading} size={30} />
      </div>
    </div>
  );
}
