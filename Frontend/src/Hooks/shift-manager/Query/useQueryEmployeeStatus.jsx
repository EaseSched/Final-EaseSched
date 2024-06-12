// GET: http://localhost:3000/employee/all?status=active
// GET: http://localhost:3000/employee/all?status=inactive

import React from "react";
import useListOfEmployeesStatusStore from "../store/useListOfEmployeesStatusStore";
import { useQuery } from "@tanstack/react-query";
//   listOfEmployeesActive: [],
//   listOfEmployeesInctive: [],
//   setlistOfEmployeesActive: (newlistOfEmployeesActive) => set({ listOfEmployeesActive: newlistOfEmployeesActive }),
//   setlistOfEmployeesInctive: (newlistOfEmployeesInctive) => set({ listOfEmployeesInctive: newlistOfEmployeesInctive }),

export default function useQueryEmployeeStatus() {
  const setlistOfEmployeesActive = useListOfEmployeesStatusStore(
    (state) => state.setlistOfEmployeesActive
  );
  const setlistOfEmployeesInctive = useListOfEmployeesStatusStore(
    (state) => state.setlistOfEmployeesInctive
  );

  const {
    data: activeData,
    isLoading: activeIsLoading,
    isError: activeIsError,
    error: activeError,
    refetch: activeRefetch,
    isFetching: activeIsFetching,
  } = useQuery({
    queryKey: [9876543, "listOfEmployeesActive"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      console.log(token);
      try {
        const response = await fetch(
          `http://localhost:3000/employee/all?status=active`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
        if (!response.ok) {
          localStorage.clear();
          return null;
        }
        const data = await response.json();
        setlistOfEmployeesActive(data);
        return data;
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response.status === 403) {
          localStorage.clear();
          return null;
        }
        if (error.message === "") {
          return null;
        }
      }
    },
  });

  const {
    data: inactiveData,
    isLoading: inactiveIsLoading,
    isError: inactiveIsError,
    error: inactiveError,
    refetch: inactiveRefetch,
    isFetching: inactiveIsFetching,
  } = useQuery({
    queryKey: [9876543, "listOfEmployeesInactive"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      console.log(token);
      try {
        const response = await fetch(
          `http://localhost:3000/employee/all?status=inactive`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
        if (!response.ok) {
          localStorage.clear();
          return null;
        }
        const data = await response.json();
        setlistOfEmployeesInctive(data);

        return data;
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response.status === 403) {
          // localStorage.clear();
          // return null;
        }
        if (error.message === "") {
          // return null;
        }
      }
    },
  });

  return {
    activeData,
    activeIsLoading,
    activeIsError,
    activeError,
    activeRefetch,
    activeIsFetching,
    inactiveData,
    inactiveIsLoading,
    inactiveIsError,
    inactiveError,
    inactiveRefetch,
    inactiveIsFetching,
  };
}
