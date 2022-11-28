import { useParams } from "react-router-dom";
import Home from "../../components/adminHome";
export default function AdminHome() {
  const { type } = useParams();
  return (
    <>
      <Home type={type ? type : "home"} />
    </>
  );
}
