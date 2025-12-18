import { Button } from "@/components/ui/button";
import { useNavigate, Routes, Route } from "react-router";
import Signup from "./SignUp";
import Signin from "./SignIn";
import Dashboard from "./Dashboard";

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold animate-fade-in-up">
        Welcome to Paytm Clone
      </h1>
      {token ? (
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            Dashboard
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
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
      )}
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* <Route path="/send" element={<Send />} /> */}
    </Routes>
  );
}

export default App;
