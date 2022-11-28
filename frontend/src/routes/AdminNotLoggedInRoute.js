import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import AdminLogin from "../pages/adminLogin"

export default function NotLoggedInRoute(){
    const {admin} = useSelector((state)=>({...state}))
    return admin ? <Navigate to="/admin"/> : <AdminLogin/>;
}