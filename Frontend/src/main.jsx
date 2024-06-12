import React from "react";
import ReactDOM from "react-dom/client";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Accounts from "./page/admin/Accounts.jsx";
import Main_shit_manager from "./page/shift-manager/Main_shift_manager.jsx";
import Login from "./page/authentication/Login.jsx";
import Main_working_areas from "./page/shift-manager/working-areas/Main_working_areas.jsx";
import Service from "./page/shift-manager/working-areas/sub_pages/Service.jsx";
import Station from "./page/shift-manager/working-areas/sub_pages/Production.jsx"; 
import Main_employee from "./page/shift-manager/employee/Main_employee.jsx";
import Employee_information from "./page/shift-manager/employee/sub_pages/Employee_information.jsx"
import Employee_on_leave from "./page/shift-manager/employee/sub_pages/Employee_on_leave.jsx";
import {
  ProtectedRoutesShiftManager,
  ProtectedRoutesAdmin,
} from "./page/authentication/ProtectedRoutes.jsx";
import Main_Generate_Schedule from "./page/shift-manager/generate-schedule/Main_Generate_Schedule";
import Step_1 from "./page/shift-manager/generate-schedule/sub_pages/Step_1";
import Step_2 from "./page/shift-manager/generate-schedule/sub_pages/Step_2";
import Step_3 from "./page/shift-manager/generate-schedule/sub_pages/Step_3";
import Dashboard from "./page/shift-manager/dashboard/Dashboard";
import Profile from "./page/Profile";
import History from "./page/History";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/admin",
    element: (
      <QueryClientProvider client={queryClient}>
        <ProtectedRoutesAdmin>
          <Accounts />
        </ProtectedRoutesAdmin>
      </QueryClientProvider>
    ),
  },
  {
    path: "/shift_manager",
    element: (
      <QueryClientProvider client={queryClient}>
        <ProtectedRoutesShiftManager>
          <Main_shit_manager />
        </ProtectedRoutesShiftManager>
      </QueryClientProvider>
    ),
    children: [
      {
        path: "/shift_manager/working_areas",
        element: <Main_working_areas />,
        children: [
          {
            path: "/shift_manager/working_areas/Service",
            element: <Service />,
          },
          {
            path: "/shift_manager/working_areas/Station",
            element: <Station />,
          },
        ],
      },
      {
        path: "/shift_manager/employee",
        element: <Main_employee />,
        children: [
          {
            path: "/shift_manager/employee/employee_information",
            element: <Employee_information />,
          },
          {
            path: "/shift_manager/employee/employee_on_Leave",
            element: <Employee_on_leave />,
          },
        ],
      },
      {
        path: "/shift_manager/generate_schedule",
        element: <Main_Generate_Schedule />,
        children: [
          {
            path: "/shift_manager/generate_schedule/step_1",
            element: <Step_1 />,
          },
          {
            path: "/shift_manager/generate_schedule/step_2",
            element: <Step_2 />,
          },
          {
            path: "/shift_manager/generate_schedule/step_3",
            element: <Step_3 />,
          },
        ],
      },
      {
        path: "/shift_manager/dashboard",
        element: <Dashboard />,
      },

      {
        path: "/shift_manager/profile",
        element: <Profile />,
      },
      {
        path: "/shift_manager/history",
        element: <History />,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
