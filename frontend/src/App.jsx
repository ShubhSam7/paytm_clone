import { Button } from "@/components/ui/button";
import { useNavigate, Routes, Route } from "react-router";
import Signup from "./SignUp";
import Signin from "./SignIn";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Welcome to Paytm Clone</h1>
      <div className="flex gap-4">
        <Button
          onClick={() => {
            navigate("/signup");
          }}
        >
          SignUp
        </Button>
        <Button
          onClick={() => {
            navigate("/signin");
          }}
        >
          SignIn
        </Button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
    </Routes>
  );
}

export default App;
