import Logout from "./Logout";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
    const navigate = useNavigate();
    if(localStorage.getItem("token")) {
        return (
            <div>
                <h1>Dashboard</h1>
                <Logout />
            </div>
        )
    }
    return navigate("/");
}

export default Dashboard;