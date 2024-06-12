import React, { useState } from "react";
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
import useQueryOnLeave from "@/Hooks/shift-manager/Query/useQueryOnLeave";

function Add_employee_on_leave(props) {

  const { employeeRefetch } = useQueryOnLeave();

  const [timeabailable, setTimeAvailable] = useState({
      shift_start: "",
      shift_end: "",}
  );
  const [employeeEnfomration, setEmployeeEnfomration] = useState({
    poscod: "",
    crew_id: "",
    name: "",
    hired_date: "",
    stations: [],
    job_status: "",
    availability: [],
  });
  const [error, setError] = useState();
  const submit = (e) => {
    
    e.preventDefault();

    const formValue = {
      // crewid : employeeEnfomration.crew_id,
      // name : employeeEnfomration.name,
      // datesOnlEave : timeabailable
      // crewid : employeeEnfomration.crew_id,
      // name: employeeEnfomration.name,
      crew_id : employeeEnfomration.crew_id ,
      end_date: timeabailable.shift_end,
      start_date: timeabailable.shift_start,
    };
    console.log(formValue);
    // axios.post("http://localhost:3000/employeeOnLeave/add", formValue).then((res) => {
      const addEmployeeOlbeave = async () => {
        
      const token = localStorage.getItem("token");
        try {
          
          const adding = await axios.post(
            "http://localhost:3000/employeeOnLeave/add",
            formValue,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`, // Include token type (Bearer)
              },
            }
          )
          employeeRefetch()

          alert(adding.data.message)
          
        } catch (error) {

          console.log(error)
          
    setError(error.response.data.error);
          
        }
      }

      addEmployeeOlbeave();
  };


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
                  onChange={(e) => {
                    e.preventDefault();
                    setEmployeeEnfomration((prev) => ({
                      ...prev,
                      crew_id: e.target.value,
                    }));
                  }}
                />
                {error?.crew_id !== null ||
                  (error && (
                    <div className=" ease-in absolute top-[110%] rounded-md p-2 w-full bg-red-300   -left-2">
                      {error?.crew_id}
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex  justify-between  ">
              {/* <div className=" flex flex-col w-full items-start space-y-2">
                <label htmlFor="employeename">Employee Name</label>
                <div className="flex w-full border border-[#D9D9D9] p-3 rounded-md space-x-2">
                  <img src={employeename} alt="" width={20} />
                  <input
                    required
                    type="text"
                    className="w-full outline-none border-none"
                    placeholder="e.g juan dela cruz"
                    onChange={(e) => {
                      e.preventDefault();
                      setEmployeeEnfomration((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }));
                    }}
                  />
                </div>
              </div> */}
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
                  <div
                    className="flex h-fit justify-stetch  w-full gap-2  "
                    key={timeabailable.id}
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
                            defaultValue={timeabailable.shift_start}
                            onChange={(e) => {
                              e.preventDefault();
                              setTimeAvailable({
                                ...timeabailable,
                                shift_start: e.target.value,
                              });
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
                            defaultValue={timeabailable.shift_end}
                            name=""
                            id=""
                            className="h-7 text-xs w-full bg-transparent pb-[1rem] outline-none border-none "
                            onChange={(e) => {
                              e.preventDefault();
                              setTimeAvailable({
                                        ...timeabailable,
                                        shift_end: e.target.value,
                                      });
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
                            (times) => times.id !== timeabailable.id
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
      <button
        type="submit"
        className={`py-3 rounded-md w-full text-white ${
          employeeEnfomration.crew_id == "" 
            ? "bg-green-200"
            : "bg-[#48C65C]"
        } `}
        disabled={
          employeeEnfomration.crew_id == "" 
        }
      >
        Add
      </button>
    </form>
  );
}

export default Add_employee_on_leave;
