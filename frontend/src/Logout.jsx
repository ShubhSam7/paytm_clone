import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Logout = () => {
  const navigate = useNavigate();
  if (localStorage.getItem("token")) {
    return (
      <div>
        <h1>Logout</h1>
        <Button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          Logout
        </Button>
      </div>
    );
  }
  return <div>Please login to continue</div>;
};

export default Logout;
