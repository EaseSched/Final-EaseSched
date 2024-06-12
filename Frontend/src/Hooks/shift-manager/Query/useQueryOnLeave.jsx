import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import useAuthStore from "@/Hooks/Authentication/useAuthStore";
import useemployeeOnLeaveStore from "../store/useEmployeeOnLeave";
import { useNavigate } from "react-router-dom";
import { set } from "date-fns";
import axios from "axios";
const useQueryOnLeave = () => {
  const user = useAuthStore((state) => state.user);
  const setemployeeOnLeave = useemployeeOnLeaveStore(
    (state) => state.setemployeeOnLeave
  );
  const navigate = useNavigate();
  const setuser = useAuthStore((state) => state.setUser);
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: [65423, "employeeOnLeave", user],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`http://localhost:3000/employeeOnLeave/all`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });
        // if (!response.ok) {
        //   setuser(null);
        //   localStorage.clear();
        //   navigate(0);
        //   navigate("../login", { replace: true });
        //   return null;
        // }
        const data = await response
        // console.log(response, "employeee inleave lol");
        setemployeeOnLeave(data.data);
        return data; // Returning data instead of response.data
        // setemployeeOnLeave([ ]);
        return ;
      } catch (error) {
        console.log(error)
        console.error("Error fetching user data:", error);
        if (error.response.status === 403) {
          // localStorage.clear();
          // navigate(0);
          // navigate("../login", { replace: true });
          // return null;
        }
        if (error.message === "") {
          // return null;
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

export default useQueryOnLeave;
