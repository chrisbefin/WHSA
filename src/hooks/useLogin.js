import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import pb from "lib/pocketbase";

const useLogin = () => {
  const navigate = useNavigate();

  return useMutation(
    async ({ email, password }) => {
      pb.authStore.clear(); // Clear any previous session
      const authData = await pb.collection("users").authWithPassword(email, password);
      return authData;
    },
    {
      onSuccess: () => {
        if (pb.authStore.isValid) {
          navigate("/home"); // Redirect to home page on successful login
        }
      },
      onError: (error) => {
        console.error("Login failed:", error);
      },
    }
  );
};

export default useLogin;
