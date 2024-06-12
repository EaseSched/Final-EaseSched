import useAuthStore from "@/Hooks/Authentication/useAuthStore";
import useGenerateScheduleStore from "@/Hooks/shift-manager/store/useGenerateSchedule";
import React, { useEffect } from "react";
import { Trash, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
export default function Step_2() {
  const {
    date,
    setDate,
    author,
    setAuthor,
    employeeOnLeave,
    setEmployeeOnLeave,
    isProcessing,
setIsProcessing
  } = useGenerateScheduleStore();

  const authorCurrent = useAuthStore();
  const employee = [
    {
      crew_id: "6546",
      author: "lucas doe",
      name: "John Doe",
      status: "active",
    },
    {
      crew_id: "5673",
      author: "lucas doe",
      name: "John Doe",
      status: "active",
    },
    {
      crew_id: "124",
      author: "emma smith",
      name: "Jane Smith",
      status: "active",
    },
    {
      crew_id: "43",
      author: "michael jones",
      name: "David Jones",
      status: "active",
    },
    {
      crew_id: "75756",
      author: "lucas doe",
      name: "John Doe",

      status: "active",
    },
    {
      crew_id: "87789",
      author: "lucas doe",
      name: "John Doe",

      status: "active",
    },
    {
      crew_id: "89098",
      author: "emma smith",
      name: "Jane Smith",

      status: "active",
    },
    {
      crew_id: "354",
      author: "michael jones",
      name: "David Jones",

      status: "active",
    },
    // ... add more data here
    {
      crew_id: "0300492042",
      author: "sarah brown",
      name: "Emily Brown",

      status: "active",
    },
    {
      crew_id: "0300492043",
      author: "james wilson",
      name: "Robert Wilson",

      status: "active",
    },
  ];

  useEffect(() => {
    setAuthor(authorCurrent.user);
    console.log("sadsad", authorCurrent.user);
    console.log(author.name);

    setEmployeeOnLeave(employee); // request on the reserver for the employee on leave on the selected date so the list will be updated with the new data and set the employee on leave with the method  "setEmployeeOnLeave()"
  }, [authorCurrent.user, date]);

  const submit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="w-full  rounded-lg p-4 text-sm">
      <form action="#" onSubmit={submit} className="space-y-4">
        <div className="flex flex-col gap-4">
          <p className="font-bold  text-gray-400">Date</p>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="shcedule_date" className="">
              Schedule Date
            </label>
            <div className="flex w-full justify-center items-center gap-2 bg-gray-100 p-2 rounded-lg px-5 ">
              <input
                type="date"
                id="shcedule_date"
                className=" text-gray-500 bg-transparent  flex-1"
                readOnly
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <Calendar width={20} className="fill-black/70" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <p className="font-bold  text-gray-400">Author</p>
          <div className="flex flex-col gap-2">
            <label htmlFor="author">Name</label>
            <input
              type="text"
              id="author"
              readOnly
              className="bg-gray-100 p-2 rounded-lg px-5 "
              defaultValue={author.name}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-6">
          <p className="font-semibold  text-gray-400">Employee on Leave</p>
          <div className="flex justify-center  px-16 items-center text-xs">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-xs ">
                  <th className="">NO</th>
                  <th>CREW ID</th>
                  <th>EMPLOYEE NAME</th>
                </tr>
              </thead>
              <tbody className="space-y-4">
                {employeeOnLeave.map((employee, index) => (
                  <tr
                    key={employee.crew_id}
                    className="text-left border-y-[15px] border-transparent"
                  >
                    <td>{index + 1}</td>
                    <td>{employee.crew_id}</td>
                    <td>{employee.name}</td>
                    <td className="flex ">
                      <button
                        className="text-red-500 flex justify-center items-center gap-1"
                        onClick={() => {
                          setEmployeeOnLeave(
                            employeeOnLeave.filter(
                              (emp) => emp.crew_id != employee.crew_id
                            )
                          ); // remove the employee on leave from the list
                        }}
                      >
                        {" "}
                        <span>
                          {" "}
                          <svg
                            width="13"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M15.3333 2.46154H12V1.84615C12 1.35652 11.7893 0.886947 11.4142 0.540726C11.0391 0.194505 10.5304 0 10 0H6C5.46957 0 4.96086 0.194505 4.58579 0.540726C4.21071 0.886947 4 1.35652 4 1.84615V2.46154H0.666667C0.489856 2.46154 0.320287 2.52637 0.195262 2.64178C0.070238 2.75719 0 2.91371 0 3.07692C0 3.24013 0.070238 3.39666 0.195262 3.51207C0.320287 3.62747 0.489856 3.69231 0.666667 3.69231H1.33333V14.7692C1.33333 15.0957 1.47381 15.4087 1.72386 15.6395C1.97391 15.8703 2.31304 16 2.66667 16H13.3333C13.687 16 14.0261 15.8703 14.2761 15.6395C14.5262 15.4087 14.6667 15.0957 14.6667 14.7692V3.69231H15.3333C15.5101 3.69231 15.6797 3.62747 15.8047 3.51207C15.9298 3.39666 16 3.24013 16 3.07692C16 2.91371 15.9298 2.75719 15.8047 2.64178C15.6797 2.52637 15.5101 2.46154 15.3333 2.46154ZM6.66667 11.6923C6.66667 11.8555 6.59643 12.012 6.4714 12.1275C6.34638 12.2429 6.17681 12.3077 6 12.3077C5.82319 12.3077 5.65362 12.2429 5.5286 12.1275C5.40357 12.012 5.33333 11.8555 5.33333 11.6923V6.76923C5.33333 6.60602 5.40357 6.4495 5.5286 6.33409C5.65362 6.21868 5.82319 6.15385 6 6.15385C6.17681 6.15385 6.34638 6.21868 6.4714 6.33409C6.59643 6.4495 6.66667 6.60602 6.66667 6.76923V11.6923ZM10.6667 11.6923C10.6667 11.8555 10.5964 12.012 10.4714 12.1275C10.3464 12.2429 10.1768 12.3077 10 12.3077C9.82319 12.3077 9.65362 12.2429 9.52859 12.1275C9.40357 12.012 9.33333 11.8555 9.33333 11.6923V6.76923C9.33333 6.60602 9.40357 6.4495 9.52859 6.33409C9.65362 6.21868 9.82319 6.15385 10 6.15385C10.1768 6.15385 10.3464 6.21868 10.4714 6.33409C10.5964 6.4495 10.6667 6.60602 10.6667 6.76923V11.6923ZM10.6667 2.46154H5.33333V1.84615C5.33333 1.68294 5.40357 1.52642 5.5286 1.41101C5.65362 1.2956 5.82319 1.23077 6 1.23077H10C10.1768 1.23077 10.3464 1.2956 10.4714 1.41101C10.5964 1.52642 10.6667 1.68294 10.6667 1.84615V2.46154Z"
                              fill="#EC1608"
                            />
                          </svg>
                        </span>{" "}
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-center ">
          <Link
            to={"/shift_manager/generate_schedule/step_1"}
            className="p-3 rounded-md bg-red-500 text-white"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
