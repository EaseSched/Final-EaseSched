import React, { useEffect, useState } from "react";
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
import useQueryAllStation from "@/Hooks/shift-manager/Query/useQueryAllStation";

function Modify_service_working_area(props) {
  
  const [timeabailable, setTimeAvailable] = useState([]);
  
  const day = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const [employeeEnfomration, setEmployeeEnfomration] = useState({
      working_area: props.workingArea.workingArea,
      no_of_employees: props.workingArea.no_of_employees,
      area_name: props.workingArea.areaName,
      availability:     props.workingArea.possible_shifts,
    });
    const oldInfomration = {
        working_area: props.workingArea.workingArea,
        no_of_employees: props.workingArea.no_of_employees,
        area_name: props.workingArea.areaName,
        possible_shifts: props.workingArea.possible_shifts,
        };

        const {stationRefetch} = useQueryAllStation()

    const [eqaul, setEqual] = useState();
    
  const [isUpdate, setUpdate] = useState();

  const [timesday, settimesday] = useState()

  console.log(props.workingArea)

    useEffect(() => {
    
      // setTimeAvailable(props.workingArea.possible_shifts.availability);

      settimesday(props.workingArea.availability)
      
      
    },[props.workingArea]);
    
    console.log(timesday,"hello world!! from servicew")
    const [error, setError] = useState();
    useEffect(() => {
        
      console.log(JSON.stringify(timeabailable));
        console.log(JSON.stringify(oldInfomration.possible_shifts));
        if (
          employeeEnfomration.working_area === oldInfomration.working_area &&
          employeeEnfomration.no_of_employees ===
            oldInfomration.no_of_employees &&
          employeeEnfomration.area_name === oldInfomration.area_name &&
          JSON.stringify(timeabailable) ===
            JSON.stringify(oldInfomration.possible_shifts)
        ) {
          setEqual(true);
        } else {
          setEqual(false);
        }
    }, [employeeEnfomration, timeabailable]);
  const submit = (e) => {
    e.preventDefault();

    // const formValue = {
    //   working_area: employeeEnfomration.working_area,
    //   no_of_employees: employeeEnfomration.no_of_employees,
    //   area_name: employeeEnfomration.area_name,
    //   possible_shifts: timeabailable,
    // };
    // console.log(formValue);
    

   
    const sub = async () => {

      const token = localStorage.getItem('token')
      console.log(`http://localhost:3000/station/${props.station_id}`)
      try {
        
        const subsss = await axios.put(`http://localhost:3000/station/${props.workingArea.station_id}`,  
        
        { 
          area_id:  props.workingArea.area_name === "Service" ? 2 : 1, 
          station_name : e.target[2].value, 
          number_of_employee: e.target[1].value, 
          availability: [
            {
              day_name:"monday",
              shift_timings:  timesday.monday
              
            },
            {
              day_name:"tuesday",
              shift_timings:  timesday.tuesday
              
            },
            {
              day_name:"wednesday",
              shift_timings:  timesday.wednesday
              
            },
            {
              day_name:"thursday",
              shift_timings:  timesday.thursday
              
            },
            {
              day_name:"friday",
              shift_timings: timesday.friday
              
            },
            {
              day_name:"saturday",
              shift_timings: timesday.saturday
              
            },
            {
              day_name:"sunday",
              shift_timings: timesday.sunday
              
            },
          ]  }
        
        ,{
            
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`
          }
          } )
        setUpdate("station hours  Updated");
        stationRefetch()
      } catch (error) {
        
        console.log(error)
        setError("ERROR Updating station hours");
      }



    }

    sub()
 


  };

  // const addDateToLeave = (day) => {
    
  //   // settimesday({
  //     //   ...timesday, 
  //     //   monday: [...timesday.monday,newTime]});
  //     const newTime = {
  //       shift_start: "01:00",
  //       shift_end: "01:00",
  //     };

  //   switch (day) {
  //     case 1:
  //       settimesday({
  //         ...timesday, 
  //         monday:[...timesday.monday,newTime]
  //       })
  //         break;
  //     case 2:
  //       settimesday({
  //         ...timesday, 
  //         tuesday:[...timesday.tuesday,newTime]
  //       })
  //         break;
  //     case 3:
  //       settimesday({
  //         ...timesday, 
  //         wednesday:[...timesday.wednesday,newTime]
  //       })
  //         break;
  //     case 4:
  //       settimesday({
  //         ...timesday, 
  //         thursday:[...timesday.thursday,newTime]
  //       })
  //         break;
  //     case 5:
  //       settimesday({
  //         ...timesday, 
  //         friday:[...timesday.friday,newTime]
  //       })
  //         break;
  //     case 6:
  //       settimesday({
  //         ...timesday, 
  //         saturday:[...timesday.saturday,newTime]
  //       })
  //         break;
  //     case 7:
  //       settimesday({
  //         ...timesday, 
  //         sunday:[...timesday.sunday,newTime]
  //       })
  //         break;
  //     default:
  //       break;
  //   }
    
  // };


const convertStringToTime = (timeString) => {
  // The specified value "07:44 undefined" does not conform to the required format.  The format is "HH:mm", "HH:mm:ss" or "HH:mm:ss.SSS" where HH is 00-23, mm is 00-59, ss is 00-59, and SSS is 000-999.

//  timestring = "07:44 AM"
    const time = timeString.split(" ");
    const timeValue = time[0].split(":");
    const hour = timeValue[0];
    const minute = timeValue[1];
    const timeValue12 = `${hour}:${minute}`;
    return timeValue12;
    
};
  return (
    <form onSubmit={submit} className="h-full  gap-6">
      <div className="h-full flex gap-6 flex-col lg:flex-row overflow-auto">
        <div className="h-full lg:h-[83%] flex-1 pt-3">
          <div className="flex w-full justify-between gap-3 ">
            <div className="w flex flex-col  items-start space-y-2 flex-1">
              <label htmlFor="poscod">Working Area</label>
              <div className="flex w-full border border-[#D9D9D9] p-3 rounded-md space-x-1 h-12">
                <img src={poscod} alt="" width={20} />
                <select
                  name="poscod"
                  id="posccod"
                  defaultValue={props.workingArea.area_name}

                  placeholder="e.g Cashier"
                  className="w-full bg-white outline-none border-none p-0 m-0"
                  onChange={(e) => {
                    e.preventDefault();
                    setEmployeeEnfomration((prev) => ({
                      ...prev,
                      working_area: e.target.value,
                    }));
                  }}
                >
                  <option value="">{props.workingArea.area_name}</option>
                </select>
              </div>
            </div>

            <div className="flex flex-1 justify-between  ">
              <div className="flex flex-col items-start space-y-2 flex-1">
                <label htmlFor="Crew">Number Of Employee</label>
                <div className="flex w-full border border-[#D9D9D9] p-3 rounded-md space-x-2 relative h-12">
                  <img src={crewid} alt="" width={20} />
                  <input
                    required
                    type="text"
                    className="w-full outline-none border-none"
                    placeholder="e.g 4"
                    defaultValue={props.workingArea.number_of_employee}
                    onChange={(e) => {
                      e.preventDefault();
                      setEmployeeEnfomration((prev) => ({
                        ...prev,
                        no_of_employees: e.target.value,
                      }));
                    }}
                  />
                  {error?.working_area !== null ||
                    (error && (
                      <div className=" ease-in absolute top-[110%] rounded-md p-2 w-full bg-red-300   -left-2">
                        {error?.working_area}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className="w flex flex-col pt-2 items-start space-y-2 flex-1">
            <label htmlFor="poscod">Area Name</label>
            <div className="flex w-full border border-[#D9D9D9] p-3 rounded-md space-x-1 h-12">
              <img src={poscod} alt="" width={20} />
              <input
                required
                type="text"
                className="w-full outline-none border-none"
                placeholder="e.g Pos"
                defaultValue={props.workingArea.station_name}
                onChange={(e) => {
                  e.preventDefault();
                  setEmployeeEnfomration((prev) => ({
                    ...prev,
                    area_name: e.target.value,
                  }));
                }}
              />
            </div>
          </div>
          <div className=" w-full h-full overflow-hidden flex-1  ">
            <div className="flex justify-between py-2">
              <label htmlFor="Time" className="flex">
                Possible Shifts{" "}
              </label>
              {/* <button
                // onClick={addDateToLeave}
                type="button"
                className="flex text-white   px-8 text-xs justify-center rounded-md  items-center w-fit bg-[#009BFF] gap-3"
              >
                <p className="text-lg">+ </p>
                <p>Add More</p>
              </button> */}
            </div>
            <div className="pb-[5rem] space-y-2 overflow-auto h-full">

              {
              timesday?.monday.map((oras, index) => {
                 return (
                  <div
                    className="flex h-fit justify-stetch  w-full gap-5  "
                   key={index}
                  >
{ index === 0 ?

<div className="flex border border-[#D9D9D9] p-2 rounded-md space-x-2 justify-center items-center flex-1">
                      {/* <label htmlFor="" className="">
                              Day
                            </label> */}
                            <button className="bg-blue-500 text-white px-3 py-1 rounded-md" type="button" onClick={() => {
  const newTime = {
    status:"new",
    shift_start: "--:--",
    shift_end: "--:--",
  };
  settimesday({
    ...timesday, 
    monday:[...timesday.monday,newTime]
  })
}}>
  Add
</button>
                      <div className="flex gap-2 px-5">
                        <img src={calendar} alt="" width={15} />
                        <select
                          value={"Monday"}
                          className="h-7 text-xsw-full outline-none border-none  "
                          // onChange={(e) => {
                          //   e.preventDefault();
                          //   console.log(e.target.value);
                          //   setTimeAvailable((prevTime) =>
                          //     //                          {
                          //     //   id: 1,
                          //     //   day_name: "tuesday",
                          //     //   shift_start: "12:13",
                          //     //   shift_end: "22:13",
                          //     // },
                          //     prevTime.map((item) =>
                          //       item.id === time.id
                          //         ? { ...item, day_name: e.target.value }
                          //         : item
                          //     )
                          //   );
                          // }}
                        >
                         <option>Monday</option>
                        </select>
                      </div>
                    </div>
                    
: <div className="w-[24.5rem]"></div>}






                    <div className={` w-full   flex border border-[#D9D9D9]  rounded-md space-x-5 justify-center  px-5 h-12
                    
                    ${
                      oras?.status &&" bg-red-500/50 "
                    }
                    
                    `}>
                
                      <div >
                        <label
                          htmlFor="time"
                          className="text-[#009BFF] text-xs"
                        >
                          Start With {oras?.shift_start.trim()}
                          {/* {(oras?.shift_start.split(":")[0].length < 2 ? "0" : "")+oras.shift_start.split(" ")[0]} */}
                        </label>
                        <div className="flex ">
                          <input
                            required
                            type="time"
                             defaultValue= {oras?.shift_start.trim()}
                           
                            onChange={(e) => {
                              e.preventDefault();
                              // alert(e.target.value)
                             
                               let monday = timesday.monday
                               monday[index] ={...monday[index], shift_start: e.target.value}
                            }}
                            name=""
                            id=""
                            className="h-7 text-xs w-full bg-transparent pb-[1rem] outline-none border-none "
                          />
                        </div>
                      </div>
                    </div>
                    <div className={` w-full   flex border border-[#D9D9D9]  rounded-md space-x-5 justify-center  px-5 h-12
                    
                    ${
                      oras?.status &&" bg-red-500/50 "
                    }
                    
                    `}>
                      <div className="p-0 m-0">
                        <label
                          htmlFor="time"
                          className="text-[#009BFF] text-xs"
                        >
                          End With
                        </label>
                        <div className="flex">
                          <input
                            required
                            type="time"
                      
                               defaultValue= {oras?.shift_end.trim()}
                            
                            name=""
                            id=""
                            className="h-7 text-xs w-full bg-transparent pb-[1rem] outline-none border-none "
                            onChange={(e) => {
                              e.preventDefault();
                              // alert(e.target.value)
                             
                               let monday = timesday.monday
                               monday[index] ={...monday[index], shift_end: e.target.value}
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className=" h-full cursor-pointer">
                      {/* <div
                        type="button"
                        onClick={() => {
                          // const newTime = timeabailable.filter(
                          //   (times) => times.id !== time.id
                          // );
                          // setTimeAvailable(newTime);

                          // setEmployeeEnfomration((prev) => ({
                          //   ...prev,
                          //   availability: timeabailable,
                          // }));
//                           const newtimes = timesday.monday.filter((ll, pol) =>{
                         
//                             if (pol === index){
//                               return false
//                             }else{
// return true
//                             }

                          
//                           }

//                         )
//                         settimesday({
//                           ...timesday, monday: newtimes
//                         })
                        }}
                        className="flex justify-center items-center w-full h-full   rounded-md"
                      >
                        <XIcon className="h-5 w-5" color="black" />
                      </div> */}
                    </div>
                  </div>
                );
              })
            }
              
              {
  timesday?.tuesday.map((oras, index) => {
     return (
      <div
        className="flex h-fit justify-stetch  w-full gap-5  "
       key={index}
       >
       { index === 0 ?
       <div className="flex border border-[#D9D9D9] p-2 rounded-md space-x-2 justify-center items-center flex-1">
            <button className="bg-blue-500 text-white px-3 py-1 rounded-md" type="button" onClick={() => {
  const newTime = {
    status:"new",
    shift_start: "--:--",
    shift_end: "--:--",
  };
  settimesday({
    ...timesday, 
    tuesday:[...timesday.tuesday,newTime]
  })
}}>
  Add
</button>
                             {/* <label htmlFor="" className="">
                                     Day
                                   </label> */}
                             <div className="flex gap-2 px-5">
                               <img src={calendar} alt="" width={15} />
                               <select
                                 value={"Tuesday"}
                                 className="h-7 text-xsw-full outline-none border-none  "
                                 // onChange={(e) => {
                                 //   e.preventDefault();
                                 //   console.log(e.target.value);
                                 //   setTimeAvailable((prevTime) =>
                                 //     //                          {
                                 //     //   id: 1,
                                 //     //   day_name: "tuesday",
                                 //     //   shift_start: "12:13",
                                 //     //   shift_end: "22:13",
                                 //     // },
                                 //     prevTime.map((item) =>
                                 //       item.id === time.id
                                 //         ? { ...item, day_name: e.target.value }
                                 //         : item
                                 //     )
                                 //   );
                                 // }}
                               >
                                <option>Tuesday</option>
                               </select>
                             </div>
                           </div>
       : <div className="w-[24.5rem]"></div>}
       
       




       <div className={` w-full   flex border border-[#D9D9D9]  rounded-md space-x-5 justify-center  px-5 h-12
                    
                    ${
                      oras?.status &&" bg-red-500/50 "
                    }
                    
                    `}>
          <div>
            <label
              htmlFor="time"
              className="text-[#009BFF] text-xs"
            >
              Start With
              {oras.shift_start.split(" ")[0]}
            </label>
            <div className="flex ">
              <input
                required
                type="time"
                 defaultValue= {oras?.shift_start.trim()}
                onChange={(e) => {
                  e.preventDefault();
                  // alert(e.target.value)
                 
                   let tuesday = timesday.tuesday
                   tuesday[index] ={...tuesday[index], shift_start: e.target.value}
                }}
                name=""
                id=""
                className="h-7 text-xs w-full bg-transparent pb-[1rem] outline-none border-none "
              />
            </div>
          </div>
        </div>
        <div className={` w-full   flex border border-[#D9D9D9]  rounded-md space-x-5 justify-center  px-5 h-12
                    
                    ${
                      oras?.status &&" bg-red-500/50 "
                    }
                    
                    `}>
   
          <div className="p-0 m-0">
            <label
              htmlFor="time"
              className="text-[#009BFF] text-xs"
            >
              End With
            </label>
            <div className="flex">
              <input
                required
                type="time"
          
                   defaultValue= {oras?.shift_end.trim()}
                
                name=""
                id=""
                className="h-7 text-xs w-full bg-transparent pb-[1rem] outline-none border-none "
                onChange={(e) => {
                  e.preventDefault();
                  // alert(e.target.value)
                 
                   let tuesday = timesday.tuesday
                   tuesday[index] ={...tuesday[index], shift_end: e.target.value}
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
  })
}
{
  timesday?.wednesday.map((oras, index) => {
     return (
      <div
        className="flex h-fit justify-stetch  w-full gap-5  "
       key={index}
       >
       { index === 0 ?
       <div className="flex border border-[#D9D9D9] p-2 rounded-md space-x-2 justify-center items-center flex-1">
                             {/* <label htmlFor="" className="">
                                     Day
                                   </label> */}    <button className="bg-blue-500 text-white px-3 py-1 rounded-md" type="button" onClick={() => {
  const newTime = {
    status:"new",
    shift_start: "--:--",
    shift_end: "--:--",
  };
  settimesday({
    ...timesday, 
    wednesday:[...timesday.wednesday,newTime]
  })
}}>
  Add
</button>
                             <div className="flex gap-2 px-5">
                               <img src={calendar} alt="" width={15} />
                               <select
                                 value={"Wednesday"}
                                 className="h-7 text-xsw-full outline-none border-none  "
                                 // onChange={(e) => {
                                 //   e.preventDefault();
                                 //   console.log(e.target.value);
                                 //   setTimeAvailable((prevTime) =>
                                 //     //                          {
                                 //     //   id: 1,
                                 //     //   day_name: "tuesday",
                                 //     //   shift_start: "12:13",
                                 //     //   shift_end: "22:13",
                                 //     // },
                                 //     prevTime.map((item) =>
                                 //       item.id === time.id
                                 //         ? { ...item, day_name: e.target.value }
                                 //         : item
                                 //     )
                                 //   );
                                 // }}
                               >
                                <option>Wednesday</option>
                               </select>
                             </div>
                           </div>
       : <div className="w-[24.5rem]"></div>}
       
       




       <div className={` w-full   flex border border-[#D9D9D9]  rounded-md space-x-5 justify-center  px-5 h-12
                    
                    ${
                      oras?.status &&" bg-red-500/50 "
                    }
                    
                    `}>
    
          <div>
            <label
              htmlFor="time"
              className="text-[#009BFF] text-xs"
            >
              Start With
              {oras.shift_start.split(" ")[0]}
            </label>
            <div className="flex ">
              <input
                required
                type="time"
                 defaultValue= {oras?.shift_start.trim()}
                onChange={(e) => {
                  e.preventDefault();
                  // alert(e.target.value)
                 
                   let wednesday = timesday.wednesday
                   wednesday[index] ={...wednesday[index], shift_start: e.target.value}
                }}
                name=""
                id=""
                className="h-7 text-xs w-full bg-transparent pb-[1rem] outline-none border-none "
              />
            </div>
          </div>
        </div>
        <div className={` w-full   flex border border-[#D9D9D9]  rounded-md space-x-5 justify-center  px-5 h-12
                    
                    ${
                      oras?.status &&" bg-red-500/50 "
                    }
                    
                    `}>
   
          <div className="p-0 m-0">
            <label
              htmlFor="time"
              className="text-[#009BFF] text-xs"
            >
              End With
            </label>
            <div className="flex">
              <input
                required
                type="time"
          
                   defaultValue= {oras?.shift_end.trim()}
                
                name=""
                id=""
                className="h-7 text-xs w-full bg-transparent pb-[1rem] outline-none border-none "
                onChange={(e) => {
                  e.preventDefault();
                  // alert(e.target.value)
                 
                   let wednesday = timesday.wednesday
                   wednesday[index] ={...wednesday[index], shift_end: e.target.value}
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
  })
}
{
  timesday?.thursday.map((oras, index) => {
     return (
      <div
        className="flex h-fit justify-stetch  w-full gap-5  "
       key={index}
       >
       { index === 0 ?
       <div className="flex border border-[#D9D9D9] p-2 rounded-md space-x-2 justify-center items-center flex-1">
                             {/* <label htmlFor="" className="">
                                     Day
                                   </label> */}    <button className="bg-blue-500 text-white px-3 py-1 rounded-md" type="button" onClick={() => {
  const newTime = {
    status:"new",
    shift_start: "--:--",
    shift_end: "--:--",
  };
  settimesday({
    ...timesday, 
    thursday:[...timesday.thursday,newTime]
  })
}}>
  Add
</button>
                             <div className="flex gap-2 px-5">
                               <img src={calendar} alt="" width={15} />
                               <select
                                 value={"Thursday"}
                                 className="h-7 text-xsw-full outline-none border-none  "
                                 // onChange={(e) => {
                                 //   e.preventDefault();
                                 //   console.log(e.target.value);
                                 //   setTimeAvailable((prevTime) =>
                                 //     //                          {
                                 //     //   id: 1,
                                 //     //   day_name: "tuesday",
                                 //     //   shift_start: "12:13",
                                 //     //   shift_end: "22:13",
                                 //     // },
                                 //     prevTime.map((item) =>
                                 //       item.id === time.id
                                 //         ? { ...item, day_name: e.target.value }
                                 //         : item
                                 //     )
                                 //   );
                                 // }}
                               >
                                <option>Thursday</option>
                               </select>
                             </div>
                           </div>
       : <div className="w-[24.5rem]"></div>}
       
       




       <div className={` w-full   flex border border-[#D9D9D9]  rounded-md space-x-5 justify-center  px-5 h-12
                    
                    ${
                      oras?.status &&" bg-red-500/50 "
                    }
                    
                    `}>
    
          <div>
            <label
              htmlFor="time"
              className="text-[#009BFF] text-xs"
            >
              Start With
              {oras.shift_start.split(" ")[0]}
            </label>
            <div className="flex ">
              <input
                required
                type="time"
                 defaultValue= {oras?.shift_start.trim()}
                onChange={(e) => {
                  e.preventDefault();
                  // alert(e.target.value)
                 
                   let thursday = timesday.thursday
                   thursday[index] ={...thursday[index], shift_start: e.target.value}
                }}
                name=""
                id=""
                className="h-7 text-xs w-full bg-transparent pb-[1rem] outline-none border-none "
              />
            </div>
          </div>
        </div>
        <div className={` w-full   flex border border-[#D9D9D9]  rounded-md space-x-5 justify-center  px-5 h-12
                    
                    ${
                      oras?.status &&" bg-red-500/50 "
                    }
                    
                    `}>
   
          <div className="p-0 m-0">
            <label
              htmlFor="time"
              className="text-[#009BFF] text-xs"
            >
              End With
            </label>
            <div className="flex">
              <input
                required
                type="time"
          
                   defaultValue= {oras?.shift_end.trim()}
                
                name=""
                id=""
                className="h-7 text-xs w-full bg-transparent pb-[1rem] outline-none border-none "
                onChange={(e) => {
                  e.preventDefault();
                  // alert(e.target.value)
                 
                   let thursday = timesday.thursday
                   thursday[index] ={...thursday[index], shift_end: e.target.value}
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
  })
}
{
  timesday?.friday.map((oras, index) => {
     return (
      <div
        className="flex h-fit justify-stetch  w-full gap-5  "
       key={index}
      >
                  
{ index === 0 ?
<div className="flex border border-[#D9D9D9] p-2 rounded-md space-x-2 justify-center items-center flex-1">
                      {/* <label htmlFor="" className="">
                              Day
                            </label> */}    <button className="bg-blue-500 text-white px-3 py-1 rounded-md" type="button" onClick={() => {
  const newTime = {
    status:"new",
    shift_start: "--:--",
    shift_end: "--:--",
  };
  settimesday({
    ...timesday, 
    friday:[...timesday.friday,newTime]
  })
}}>
  Add
</button>
                      <div className="flex gap-2 px-5">
                        <img src={calendar} alt="" width={15} />
                        <select
                          value={"friday"}
                          className="h-7 text-xsw-full outline-none border-none  "
                          // onChange={(e) => {
                          //   e.preventDefault();
                          //   console.log(e.target.value);
                          //   setTimeAvailable((prevTime) =>
                          //     //                          {
                          //     //   id: 1,
                          //     //   day_name: "tuesday",
                          //     //   shift_start: "12:13",
                          //     //   shift_end: "22:13",
                          //     // },
                          //     prevTime.map((item) =>
                          //       item.id === time.id
                          //         ? { ...item, day_name: e.target.value }
                          //         : item
                          //     )
                          //   );
                          // }}
                        >
                         <option>friday</option>
                        </select>
                      </div>
                    </div>
: <div className="w-[24.5rem]"></div>}



<div className={` w-full   flex border border-[#D9D9D9]  rounded-md space-x-5 justify-center  px-5 h-12
                    
                    ${
                      oras?.status &&" bg-red-500/50 "
                    }
                    
                    `}>
    
          <div>
            <label
              htmlFor="time"
              className="text-[#009BFF] text-xs"
            >
              Start With
              {oras.shift_start.split(" ")[0]}
            </label>
            <div className="flex ">
              <input
                required
                type="time"
                 defaultValue= {oras?.shift_start.trim()}
                onChange={(e) => {
                  e.preventDefault();
                  // alert(e.target.value)
                 
                   let friday = timesday.friday
                   friday[index] ={...friday[index], shift_start: e.target.value}
                }}
                name=""
                id=""
                className="h-7 text-xs w-full bg-transparent pb-[1rem] outline-none border-none "
              />
            </div>
          </div>
        </div>
        <div className={` w-full   flex border border-[#D9D9D9]  rounded-md space-x-5 justify-center  px-5 h-12
                    
                    ${
                      oras?.status &&" bg-red-500/50 "
                    }
                    
                    `}>
   
          <div className="p-0 m-0">
            <label
              htmlFor="time"
              className="text-[#009BFF] text-xs"
            >
              End With
            </label>
            <div className="flex">
              <input
                required
                type="time"
          
                   defaultValue= {oras?.shift_end.trim()}
                
                name=""
                id=""
                className="h-7 text-xs w-full bg-transparent pb-[1rem] outline-none border-none "
                onChange={(e) => {
                  e.preventDefault();
                  // alert(e.target.value)
                 
                   let friday = timesday.friday
                   friday[index] ={...friday[index], shift_end: e.target.value}
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
  })
}
{
  timesday?.saturday.map((oras, index) => {
     return (
      <div
        className="flex h-fit justify-stetch  w-full gap-5  "
       key={index}
       >
       { index === 0 ?
       <div className="flex border border-[#D9D9D9] p-2 rounded-md space-x-2 justify-center items-center flex-1">
                             {/* <label htmlFor="" className="">
                                     Day
                                   </label> */}    <button className="bg-blue-500 text-white px-3 py-1 rounded-md" type="button" onClick={() => {
  const newTime = {
    status:"new",
    shift_start: "--:--",
    shift_end: "--:--",
  };
  settimesday({
    ...timesday, 
    saturday:[...timesday.saturday,newTime]
  })
}}>
  Add
</button>
                             <div className="flex gap-2 px-5">
                               <img src={calendar} alt="" width={15} />
                               <select
                                 value={"saturday"}
                                 className="h-7 text-xsw-full outline-none border-none  "
                                 // onChange={(e) => {
                                 //   e.preventDefault();
                                 //   console.log(e.target.value);
                                 //   setTimeAvailable((prevTime) =>
                                 //     //                          {
                                 //     //   id: 1,
                                 //     //   day_name: "tuesday",
                                 //     //   shift_start: "12:13",
                                 //     //   shift_end: "22:13",
                                 //     // },
                                 //     prevTime.map((item) =>
                                 //       item.id === time.id
                                 //         ? { ...item, day_name: e.target.value }
                                 //         : item
                                 //     )
                                 //   );
                                 // }}
                               >
                                <option>saturday</option>
                               </select>
                             </div>
                           </div>
       : <div className="w-[24.5rem]"></div>}
       
       


       <div className={` w-full   flex border border-[#D9D9D9]  rounded-md space-x-5 justify-center  px-5 h-12
                    
                    ${
                      oras?.status &&" bg-red-500/50 "
                    }
                    
                    `}>
    
          <div>
            <label
              htmlFor="time"
              className="text-[#009BFF] text-xs"
            >
              Start With
              {oras.shift_start.split(" ")[0]}
            </label>
            <div className="flex ">
              <input
                required
                type="time"
                 defaultValue= {oras?.shift_start.trim()}
                onChange={(e) => {
                  e.preventDefault();
                  // alert(e.target.value)
                 
                   let saturday = timesday.saturday
                   saturday[index] ={...saturday[index], shift_start: e.target.value}
                }}
                name=""
                id=""
                className="h-7 text-xs w-full bg-transparent pb-[1rem] outline-none border-none "
              />
            </div>
          </div>
        </div>
        <div className={` w-full   flex border border-[#D9D9D9]  rounded-md space-x-5 justify-center  px-5 h-12
                    
                    ${
                      oras?.status &&" bg-red-500/50 "
                    }
                    
                    `}>
   
          <div className="p-0 m-0">
            <label
              htmlFor="time"
              className="text-[#009BFF] text-xs"
            >
              End With
            </label>
            <div className="flex">
              <input
                required
                type="time"
          
                   defaultValue= {oras?.shift_end.trim()}
                
                name=""
                id=""
                className="h-7 text-xs w-full bg-transparent pb-[1rem] outline-none border-none "
                onChange={(e) => {
                  e.preventDefault();
                  // alert(e.target.value)
                 
                   let saturday = timesday.saturday
                   saturday[index] ={...saturday[index], shift_start: e.target.value}
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
  })
}
{
  timesday?.sunday.map((oras, index) => {
     return (
      <div
        className="flex h-fit justify-stetch  w-full gap-5  "
       key={index}
       >
       { index === 0 ?
       <div className="flex border border-[#D9D9D9] p-2 rounded-md space-x-2 justify-center items-center flex-1">
                             {/* <label htmlFor="" className="">
                                     Day
                                   </label> */}    <button className="bg-blue-500 text-white px-3 py-1 rounded-md" type="button" onClick={() => {
  const newTime = {
    status:"new",
    shift_start: "--:--",
    shift_end: "--:--",
  };
  settimesday({
    ...timesday, 
    sunday:[...timesday.sunday,newTime]
  })
}}>
  Add
</button>
                             <div className="flex gap-2 px-5">
                               <img src={calendar} alt="" width={15} />
                               <select
                                 value={"Sunday"}
                                 className="h-7 text-xsw-full outline-none border-none  "
                                 // onChange={(e) => {
                                 //   e.preventDefault();
                                 //   console.log(e.target.value);
                                 //   setTimeAvailable((prevTime) =>
                                 //     //                          {
                                 //     //   id: 1,
                                 //     //   day_name: "tuesday",
                                 //     //   shift_start: "12:13",
                                 //     //   shift_end: "22:13",
                                 //     // },
                                 //     prevTime.map((item) =>
                                 //       item.id === time.id
                                 //         ? { ...item, day_name: e.target.value }
                                 //         : item
                                 //     )
                                 //   );
                                 // }}
                               >
                                <option>Sunday</option>
                               </select>
                             </div>
                           </div>
       : <div className="w-[24.5rem]"></div>}
       
       

       <div className={` w-full   flex border border-[#D9D9D9]  rounded-md space-x-5 justify-center  px-5 h-12
                    
                    ${
                      oras?.status &&" bg-red-500/50 "
                    }
                    
                    `}>
    
          <div>
            <label
              htmlFor="time"
              className="text-[#009BFF] text-xs"
            >
              Start With
              {oras.shift_start.split(" ")[0]}
            </label>
            <div className="flex ">
              <input
                required
                type="time"
                 defaultValue= {oras?.shift_start.trim()}
                onChange={(e) => {
                  e.preventDefault();
                  // alert(e.target.value)
                 
                   let sunday = timesday.sunday
                   sunday[index] ={...sunday[index], shift_start: e.target.value}
                }}
                name=""
                id=""
                className="h-7 text-xs w-full bg-transparent pb-[1rem] outline-none border-none "
              />
            </div>
          </div>
        </div>
        <div className={` w-full   flex border border-[#D9D9D9]  rounded-md space-x-5 justify-center  px-5 h-12
                    
                    ${
                      oras?.status &&" bg-red-500/50 "
                    }
                    
                    `}>
   
          <div className="p-0 m-0">
            <label
              htmlFor="time"
              className="text-[#009BFF] text-xs"
            >
              End With
            </label>
            <div className="flex">
              <input
                required
                type="time"
          
                   defaultValue= {oras?.shift_end.trim()}
                
                name=""
                id=""
                className="h-7 text-xs w-full bg-transparent pb-[1rem] outline-none border-none "
                onChange={(e) => {
                  e.preventDefault();
                  // alert(e.target.value)
                 
                   let sunday = timesday.sunday
                   sunday[index] ={...sunday[index], shift_end: e.target.value}
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
  })
}
  







  

             
  
            </div>
            {/* <div className=" overflow-auto space-y-2 h-full w-full pb-14 ">
              {timeabailable.map((time, index) => {
                {
                  console.log(time);
                }
                return (
                  <div
                    className="flex h-fit justify-stetch  w-full gap-2  "
                    key={time.id}
                  >
                    <div className=" w-full   flex border border-[#D9D9D9]  rounded-md space-x-5 justify-center  px-5 h-12">
                
                      <div>
                        <label
                          htmlFor="time"
                          className="text-[#009BFF] text-xs"
                        >
                          Start With
                        </label>
                        <div className="flex ">
                          <input
                            required
                            type="time"
                            defaultValue={convertStringToTime(time.start_time)}
                            // time.start_time
                            onChange={(e) => {
                              e.preventDefault();
                              setTimeAvailable((prevTime) =>
                                prevTime.map((item) =>
                                  item.id === time.id
                                    ? {
                                        ...item,
                                        start_time: e.target.value,
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
               
                      <div className="p-0 m-0">
                        <label
                          htmlFor="time"
                          className="text-[#009BFF] text-xs"
                        >
                          End With
                        </label>
                        <div className="flex">
                          <input
                            required
                            type="time"
                            defaultValue={
                      
                              convertStringToTime(time.end_time)
                            }
                            name=""
                            id=""
                            className="h-7 text-xs w-full bg-transparent pb-[1rem] outline-none border-none "
                            onChange={(e) => {
                              e.preventDefault();
                              setTimeAvailable((prevTime) =>
                                prevTime.map((item) =>
                                  item.id === time.id
                                    ? { ...item, end_time: e.target.value }
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
                    <div className=" h-full cursor-pointer">
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
                    </div>
                  </div>
                );
              })}
            </div> */}
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
          eqaul ? "bg-green-200" : "bg-[#48C65C]"
        } `}
        disabled={eqaul ? true : false}

        
      >
        Modify
      </button>
    </form>
  );
}

export default Modify_service_working_area;
