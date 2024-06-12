import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import useAuthStore from "@/Hooks/Authentication/useAuthStore";
import uselistOfEmployeesStore from "../store/useListOfEmployeesStore";
import { useNavigate } from "react-router-dom";
import { set } from "date-fns";
const useQueryEmployees = () => {
  const user = useAuthStore((state) => state.user);
  const setlistOfEmployees = uselistOfEmployeesStore(
    (state) => state.setlistOfEmployees
  );
  const navigate = useNavigate();
  const setuser = useAuthStore((state) => state.setUser);
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: [9876543, "listOfEmployees", user],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      console.log(token);
      try {
        const response = await fetch(`http://localhost:3000/employee/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });
        if (!response.ok) {
          setuser(null);
          localStorage.clear();
          // navigate(0);
          navigate("/login", { replace: true });
          return null;
        }
        console.log(response);
        const data = await response.json();
        setlistOfEmployees(data);
        return data; // Returning data instead of response.data
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response.status === 403) {
          // localStorage.clear();
          // navigate(0);
          // navigate("/login", { replace: true });
          return null;
        }
        if (error.message === "") {
          return null;
        } // Return null or an empty object
      }
    },
  });

  return {
    employeeData: data,
    employeeIsLoading: isLoading,
    employeeIsError: isError,
    employeError: error,
    employeeRefetch: refetch,
    employeeIsFetching: isFetching,
  };
};

export default useQueryEmployees;
