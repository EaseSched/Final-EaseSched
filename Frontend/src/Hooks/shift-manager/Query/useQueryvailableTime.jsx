import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import useAuthStore from "@/Hooks/Authentication/useAuthStore";
import { useNavigate } from "react-router-dom";
import { set } from "date-fns";
import useAvailableTime from "../store/useAvailableTime";
// day_ids: null;
// hired_date: "2023-12-31T16:00:00.000Z";
// identification_number: 21;
// person_name: "Gracia Villanueva";
// personal_information_id: 1;
// poscod: "CRE";
// record_status: "1";
// status: "";
// working_information_id: 1;
const useQueryvailableTime = (working_information_id) => {
  console.log(working_information_id);
  const user = useAuthStore((state) => state.user);
  const setuseAvailableTime = useAvailableTime(state => state.setAvailableTime)
  const navigate = useNavigate();
  const setuser = useAuthStore((state) => state.setUser);
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: [5343, "availableTime", user],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      console.log(token);
      try {
        const response = await fetch(
          `http://localhost:3000/employee/${working_information_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
        if (!response.ok) {
          setuser(null);
          localStorage.clear();
          // navigate(0);
          navigate("/login", { replace: true });
          return null;
        }
        const data = await response.json();
        console.log(data)
        setuseAvailableTime(data);
        return data; // Returning data instead of response.data
      } catch (error) {
        console.error("Error fetching user data:", error);
        // if (error.response.status === 403) {
        //   // localStorage.clear();
        //   // navigate(0);
        //   // navigate("/login", { replace: true });
        //   // return null;
        // }
        // if (error.message === "") {
        //   // return null;
        // } // Return null or an empty object
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

export default useQueryvailableTime;
