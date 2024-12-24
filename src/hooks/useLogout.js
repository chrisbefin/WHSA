import { useNavigate } from "react-router-dom";
import { useState } from "react";
import pb from "lib/pocketbase";

const useLogout = () => {
  const [dummy, setDummy] = useState(0);
  const navigate = useNavigate();

  function logout() {
    pb.authStore.clear();
    setDummy(Math.random());
    navigate("/login"); // Redirect to login page after logout
  }

  return logout;
};

export default useLogout;
