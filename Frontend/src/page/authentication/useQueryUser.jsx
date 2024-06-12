import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import useAuthStore from "@/Hooks/Authentication/useAuthStore";
import useAccountsStore from "@/Hooks/admin/useAccountsStore";
import { useNavigate } from "react-router-dom";
const useQueryUser = () => {
  const user = useAuthStore((state) => state.user);
  const setAccounts = useAccountsStore((state) => state.setAccounts);
  const navigate = useNavigate();
  const setuser = useAuthStore(state=> state.setUser)
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: [231, "user", user],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      console.log(token)
      try {
        const response = await fetch(`http://localhost:3000/user/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });
        const data = await response.json();
        console.log("User: ",data)
        setAccounts(data.users);
        return data.users; // Returning data instead of response.data
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response.status === 403) {
          localStorage.clear();
          navigate(0);
          navigate("../login", { replace: true });
        } 
        if (error.message === "") {
          return null;
        } // Return null or an empty object
      }
    },
  });

  return {
    userData: data,
    userIsLoading: isLoading,
    userIsError: isError,
    userError: error,
    userRefetch: refetch,
    userIsFetching: isFetching,
  };
};

export default useQueryUser;
