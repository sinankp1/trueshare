import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Login from "../pages/login";
import AdminLogin from "../pages/adminLogin"

export default function AdminLoggedInRoutes(){
    const {admin} = useSelector((state)=>({...state}));
    return admin ? <Outlet/> : <AdminLogin/>;
}