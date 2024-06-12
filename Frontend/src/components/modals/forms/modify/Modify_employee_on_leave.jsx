import React, { useEffect, useRef, useState } from "react";
import calendar from "@/assets/calendar.svg";
import clock from "@/assets/clock.svg";
import crewid from "@/assets/crewid.svg";
import employeename from "@/assets/employeename.svg";
import poscod from "@/assets/poscod.svg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import useQueryEmployees from "@/Hooks/shift-manager/Query/useQueryEmployees";
import useStations from "@/Hooks/shift-manager/store/useStations";
import { Calendar, X, XIcon } from "lucide-react";
import { set } from "date-fns";

function Modify_employee_on_leave(props) {
  const employeesExistingDate = [
    {
      id: 1,
      shift_start: "2022-10-10",
      shift_end: "2022-10-11",
    },
    {
      id: 2,
      shift_start: "2022-10-12",
      shift_end: "2022-10-13",
    },
    {
      id: 3,
      shift_start: "2022-10-14",
      shift_end: "2022-10-15",
    },
    {
      id: 4,
      shift_start: "2022-10-16",
      shift_end: "2022-10-17",
    },
    {
      id: 5,
      shift_start: "2022-10-18",
      shift_end: "2022-10-19",
    },
    {
      id: 6,
      shift_start: "2022-10-20",
      shift_end: "2022-10-21",
    },
    // Add more dates here

  ] /// request on the backend of employee on leave then map the data here
  const [timeabailable, setTimeAvailable] = useState([]);
  const oldEmployeeDate = [...employeesExistingDate]
  const [employeeEnfomration, setEmployeeEnfomration] = useState({
    poscod: "",
    crew_id: "",
    name: "",
    hired_date: "",
    stations: [],
    job_status: "",
    availability: [],
  });
  
  useEffect(() => {

    console.log(props.employee)
  },[])
    const [error, setError] = useState();
    const submitbttn = useRef();
    const [isEqual, seEqual] = useState();

 useEffect(() => {
   setTimeAvailable([{
    shift_end: props.employee.end_date,
    shift_start: props.employee.start_date
   }]);

   console.log(timeabailable,"aghhhhhhhhh")
 }, []);

 useEffect(() => { 
  
  console.log(timeabailable, "timeabailable")
  console.log(oldEmployeeDate, "oldEmployeeDate")
  seEqual(
    JSON.stringify(timeabailable) === JSON.stringify(oldEmployeeDate)
  );
 },[timeabailable])

  const submit = (e) => {
    e.preventDefault();

    const formValue = {
      crewid: employeeEnfomration.crew_id,
      name: employeeEnfomration.name,
      newEmployeeLeaveDate: timeabailable,
    };

    const updateing = async ( ) => {
// name;
      try {
        
      const token = localStorage.getItem("token");
        const aupd = await axios.put(
          `http://localhost:3000/employeeOnLeave/update/${props.employee.name}`,
          {
            end_date: timeabailable[0].shift_end,
            start_date: timeabailable[0].shift_start,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
        
    setUpdate("Employee Leave Date Updated");


      } catch (error) {
        console.log(error)
        
    
    setError("ERROR Updating Employee Leave Date");
        
      }
    }

    updateing()
  };

 
  const addDateToLeave = () => {
    const newTime = {
      id: timeabailable.length + 1,
      shift_start: "",
      shift_end: "",
    };

    setTimeAvailable([...timeabailable, newTime]);
  };
  
  const [isUpdate, setUpdate] = useState();
  return (
    <form onSubmit={submit} className="h-full  gap-6">
      <div className="h-full flex gap-6 flex-col lg:flex-row overflow-auto">
        <div className="h-full lg:h-[83%] flex-1 pt-3">
          <div className="flex w-full justify-between gap-3 ">
            <div className="flex flex-col items-start space-y-2 flex-1">
              <label htmlFor="Crew">Crew ID</label>
              <div className="flex w-full border border-[#D9D9D9] p-3 rounded-md space-x-2 relative h-12">
                <img src={crewid} alt="" width={20} />
                <input
                  required
                  type="text"
                  className="w-full outline-none border-none"
                  placeholder="e.g 0300207053"
                  defaultValue={props.id}
                  readOnly
                />
              </div>
            </div>
            <div className="flex flex-1 justify-between  ">
              <div className=" flex flex-col w-full items-start space-y-2">
                <label htmlFor="employeename">Employee Name</label>
                <div className="flex w-full border border-[#D9D9D9] p-3 rounded-md space-x-2">
                  <img src={employeename} alt="" width={20} />
                  <input
                    required
                    type="text"
                    className="w-full outline-none border-none"
                    placeholder="e.g juan dela cruz"
                    defaultValue={props.employee.name}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
          <div className=" w-full h-full overflow-hidden flex-1  ">
            <div className="flex justify-between py-2">
              <label htmlFor="Time" className="flex">
                Time Availability
              </label>
              {/* <button
                onClick={addDateToLeave}
                type="button"
                className="flex text-white   px-8 text-xs justify-center rounded-md  items-center w-fit bg-[#009BFF] gap-3"
              >
                <p className="text-lg">+ </p>
                <p>Add More</p>
              </button> */}
            </div>
            <div className=" overflow-auto space-y-2 h-full w-full pb-14 ">
              {timeabailable.map((time, index) => {
                return (
                  <div
                    className="flex h-fit justify-stetch  w-full gap-2  "
                    key={time.id}
                  >
                    <div className=" w-full   flex border border-[#D9D9D9]  rounded-md space-x-5 justify-center  px-5 h-12">
                      {/* <img src={clock} alt="" width={20} /> */}
                      <div>
                        <label
                          htmlFor="time"
                          className="text-[#009BFF] text-xs"
                        >
                          Start
                        </label>
                        <div className="flex ">
                          <input
                            required
                            type="date"
                            defaultValue={time.shift_start}
                            onChange={(e) => {
                              e.preventDefault();
                              setTimeAvailable((prevTime) =>
                                prevTime.map((item) =>
                                  item.id === time.id
                                    ? {
                                        ...item,
                                        shift_start: e.target.value,
                                      }
                                    : item
                                )
                              );
                              setEmployeeEnfomration((prev) => ({
                                ...prev,
                                availability: timeabailable,
                              }));
                            }}
                            name=""
                            id=""
                            className="h-7 text-xs w-full bg-transparent pb-[1rem] outline-none border-none "
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-full   flex border border-[#D9D9D9]  rounded-md space-x-5 justify-center  px-5 h-12">
                      {/* <img src={clock} alt="" width={20} /> */}
                      <div className="p-0 m-0">
                        <label
                          htmlFor="time"
                          className="text-[#009BFF] text-xs"
                        >
                          End
                        </label>
                        <div className="flex">
                          <input
                            required
                            type="date"
                            defaultValue={time.shift_end}
                            name=""
                            id=""
                            className="h-7 text-xs w-full bg-transparent pb-[1rem] outline-none border-none "
                            onChange={(e) => {
                              e.preventDefault();
                              setTimeAvailable((prevTime) =>
                                prevTime.map((item) =>
                                  item.id === time.id
                                    ? { ...item, shift_end: e.target.value }
                                    : item
                                )
                              );
                              setEmployeeEnfomration((prev) => ({
                                ...prev,
                                availability: timeabailable,
                              }));
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    {/* <div className=" h-full cursor-pointer">
                      <div
                        type="button"
                        onClick={() => {
                          const newTime = timeabailable.filter(
                            (times) => times.id !== time.id
                          );
                          setTimeAvailable(newTime);

                          setEmployeeEnfomration((prev) => ({
                            ...prev,
                            availability: timeabailable,
                          }));
                        }}
                        className="flex justify-center items-center w-full h-full   rounded-md"
                      >
                        <XIcon className="h-5 w-5" color="black" />
                      </div>
                    </div> */}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {error && (
        <div className="absolute bottom-20 rounded-md flex  bg-red-300 text-balance  p-2">
          <XIcon
            className="pr-2"
            onClick={() => {
              setError();
            }}
          />
          {error}
        </div>
      )}
      {isUpdate && (
        <div className="absolute bottom-20 rounded-md flex  bg-green-300 text-balance  p-2">
          <XIcon
            className="pr-2"
            onClick={() => {
              setUpdate();
            }}
          />
          {isUpdate}
        </div>
      )}
      <button
        type="submit"
        className={`py-3 rounded-md w-full text-white ${
          isEqual ? "bg-green-200" : "bg-[#48C65C]"
        }   `}
        disabled={isEqual}
        ref={submitbttn}
      >
        Modify
      </button>
      <button></button>
    </form>
  );
}

export default Modify_employee_on_leave;
