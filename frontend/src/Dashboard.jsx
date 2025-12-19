import { useState, useEffect } from "react";
import Logout from "./Logout";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Helper function to decode JWT token (without verification - verification happens on backend)
const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    // Decode token to get userId
    const decoded = decodeToken(token);
    const myId = decoded?.userId;

    if (!myId) {
      setError("Invalid token");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch balance
        const balanceResponse = await fetch(
          "http://localhost:3000/api/v1/account/balance",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const balanceResult = await balanceResponse.json();

        if (!balanceResponse.ok) {
          throw new Error(balanceResult.message || "Failed to fetch balance");
        }

        setBalance(balanceResult.balance);

        // Fetch friends (users)
        const friendsResponse = await fetch(
          "http://localhost:3000/api/v1/user/bulk",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const friendsResult = await friendsResponse.json();

        if (!friendsResponse.ok) {
          throw new Error(friendsResult.message || "Failed to fetch friends");
        }

        // Filter out current user
        const filteredFriends = friendsResult.user.filter(
          (user) => user._id !== myId
        );
        setFriends(filteredFriends);
      } catch (err) {
        console.error("Data fetch error:", err);
        setError(err.message || "Failed to fetch data");
        // If token is invalid, clear it and redirect
        if (
          err.message.includes("token") ||
          err.message.includes("Authorization")
        ) {
          localStorage.removeItem("token");
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleSendMoney = (friendId) => {
    // TODO: Navigate to send money page or open modal
    console.log("Send money to:", friendId);
    // You can navigate to a send money page or open a modal
    // navigate(`/send?to=${friendId}`);
  };

  const token = localStorage.getItem("token");

  if (!token) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4">
        <div className="text-xl text-red-500">Error: {error}</div>
        <Logout />
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4">
      <div className="w-full max-w-md border-2 border-black rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="text-xl mb-4">
          Your balance is ₹{balance?.toLocaleString() || "0"}
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Friends</h2>
          {friends.length === 0 ? (
            <p className="text-gray-500">No friends found</p>
          ) : (
            <div className="space-y-2">
              {friends.map((friend) => (
                <div
                  key={friend._id}
                  className="flex items-center justify-between p-3 border border-gray-300 rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {friend.firstName} {friend.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{friend.username}</p>
                  </div>
                  <Button
                    onClick={() => handleSendMoney(friend._id)}
                    className="ml-4"
                  >
                    Send Money
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          <Logout />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
