import useAuthStore from "@/Hooks/Authentication/useAuthStore";
import useGenerateScheduleStore from "@/Hooks/shift-manager/store/useGenerateSchedule";
import React, { useEffect, useState } from "react";
import { Trash, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import axios from "axios";

import { CSVLink, CSVDownload } from "react-csv";

export default function Dashboard() {
  
  const [csvData, setCsvData] = React.useState([]);
  const {
    date,
    setDate,
    author,
    setAuthor,
    employeeOnLeave,
    setEmployeeOnLeave,
    generatedSchedule,
    isProcessing,
    isDone,
setIsDone,
    setIsProcessing,
    setGeneratedSchedule
    
  } = useGenerateScheduleStore();

  const authorCurrent = useAuthStore();
const [currentview, setcurrentview] = useState(
  {
    production:[],
    service:[],
  }
);
 const navigate = useNavigate();
 const [colorsa , setColoraa] = useState({
  currentColor: "#D3FDC0",
  nextDat: "#EDC0FD"
 })
  useEffect(() => {
    setAuthor(authorCurrent.user);
    setIsProcessing(false)
    setcurrentview({
      service:generatedSchedule?.service?.monday,
      // tuesday:generatedSchedule.service.tuesday.filter(filt => filt.station_id === 2 ),
      // wednesday:generatedSchedule.service.wednesday.filter(filt => filt.station_id === 3 ),
      // thursday:generatedSchedule.service.thursday.filter(filt => filt.station_id === 4 ),
      // friday:generatedSchedule.service.friday.filter(filt => filt.station_id === 5 ),
      // saturday:generatedSchedule.service.saturday.filter(filt => filt.station_id === 6 ),
      // sunday:generatedSchedule.service.sunday.filter(filt => filt.station_id === 7 ),
      
      production:generatedSchedule?.production?.monday,
      // tuesday:generatedSchedule.production.tuesday.filter(filt => filt.station_id === 2 ),
      // wednesday:generatedSchedule.production.wednesday.filter(filt => filt.station_id === 3 ),
      // thursday:generatedSchedule.production.thursday.filter(filt => filt.station_id === 4 ),
      // friday:generatedSchedule.production.friday.filter(filt => filt.station_id === 5 ),
      // saturday:generatedSchedule.production.saturday.filter(filt => filt.station_id === 6 ),
      // sunday:generatedSchedule.production.sunday.filter(filt => filt.station_id === 7 ),
      
    })

   
    // console.log(generatedSchedule?.monday,"hello")
    // console.log(generatedSchedule?.monday?.filter(p => p.area_name === "Service"),"monday")
    // console.log(generatedSchedule?.tuesday?.filter(p => p.area_name === "Service"),"tuesday")
    // console.log(generatedSchedule?.wednesday?.filter(p => p.area_name === "Service"),"wednesday")
    // console.log(generatedSchedule?.thursday?.filter(p => p.area_name === "Service"),"thursday")
    // console.log(generatedSchedule?.friday?.filter(p => p.area_name === "Service"),"friday")
    // console.log(generatedSchedule?.saturday?.filter(p => p.area_name === "Service"),"saturday")
    // console.log(generatedSchedule?.sunday?.filter(p => p.area_name === "Service"),"sunday")
    

  }, [authorCurrent.user, date,]);
  const submit = (e) => {
    e.preventDefault();
  
    setIsDone(false);

  };
  useEffect(() => {

    const getGeneratedSchedule = async () => {
        try {
            // promise

            new Promise((resolve, reject) => {
                       setGeneratedSchedule({
                         service: employee,
                         production: employee,
                         date: "2022-01-01",
                       });
                        resolve();

            }).then((res) => {
                   const header = [
                     "crew_id",
                     "author",
                     "name",
                     "status",
                     "shift_start",
                     "shift_end",
                   ];
                   const arrayXommaseparated = [
                     [
                       "crew_id",
                       "author",
                       "name",
                       "status",
                       "shift_start",
                       "shift_end",
                     ],
                   ];

                   const csv = arrayXommaseparated.concat(
                     generatedSchedule?.service.map((item) => [
                       item.crew_id,
                       item.author,
                       item.name,
                       item.status,
                       item.shift_start,
                       item.shift_end,
                     ])
                   );

                   setCsvData(csv);

                   

                   console.log(csv, "csv");
            })
   
       
          // adding the header to the csv data
        } catch (error) {
            
        }
    }    
  
    // format the data to be downloaded
    // const csvData = [
    //   ["firstname", "lastname", "email"],
    //   ["Ahmed", "Tomi", "ah@smthing.co.com"],
    //   ["Raed", "Labes", "rl@smthing.co.com"],
    //   ["Yezzi", "Min l3b", "ymin@cocococo.com"],
    // ];
getGeneratedSchedule()

},[])
useEffect(() => {
  const getLatestData = async () => {
    try {

      const gets = await axios.get("http://localhost:3000/sched/schedule/latest",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      }
    )
    
    setGeneratedSchedule(JSON.parse(gets.data.record.records))
    setcurrentview({
      service:generatedSchedule?.service?.monday,
      // tuesday:generatedSchedule.service.tuesday.filter(filt => filt.station_id === 2 ),
      // wednesday:generatedSchedule.service.wednesday.filter(filt => filt.station_id === 3 ),
      // thursday:generatedSchedule.service.thursday.filter(filt => filt.station_id === 4 ),
      // friday:generatedSchedule.service.friday.filter(filt => filt.station_id === 5 ),
      // saturday:generatedSchedule.service.saturday.filter(filt => filt.station_id === 6 ),
      // sunday:generatedSchedule.service.sunday.filter(filt => filt.station_id === 7 ),
      
      production:generatedSchedule?.production?.monday,
      // tuesday:generatedSchedule.production.tuesday.filter(filt => filt.station_id === 2 ),
      // wednesday:generatedSchedule.production.wednesday.filter(filt => filt.station_id === 3 ),
      // thursday:generatedSchedule.production.thursday.filter(filt => filt.station_id === 4 ),
      // friday:generatedSchedule.production.friday.filter(filt => filt.station_id === 5 ),
      // saturday:generatedSchedule.production.saturday.filter(filt => filt.station_id === 6 ),
      // sunday:generatedSchedule.production.sunday.filter(filt => filt.station_id === 7 ),
      
    })
    // console.log("LEZGOE",gets.data.record.records)

    // set(
    //   JSON.parse(gets.data.schedule)
    // )
      
    } catch (error) {
      
    }
  }
  getLatestData()
  
},[])

  return (

    <div className="w-full px-9">
    <div className="flex justify-between pt-4 items-center">
      <div>
        <p className="font-semibold text-xl">Working Area</p>
        <p className="text-xs text-[#C2C2C2]">
          Utilized on {generatedSchedule?.date}
        </p>
      </div>
      <div className="rounded-full text-xs text-center bg-white w-fit flex h-10  justify-center items-center px-2 space-x-3">
        <Link
          className={`rounded-full h-[70%] px-5 flex justify-center items-center bg-[#4CA8FF] text-white`}
        >
          Last Generated Schedule
        </Link>
      </div>
      {/* <CSVLink 
        data={csvData}
          filename={`Genearated-Schedule for ${
          generatedSchedule?.date
          }.csv`}
        className="rounded-full  border-white border-4 text-center text-xs bg-[#4CA8FF] w-fit flex  justify-center items-center h-8 px-5 text-white"
      >
        export
      </CSVLink> */}
    </div>

    <div className="w-full  rounded-lg p-4 text-sm bg-white p-5 mt-6">
      <>
            
      
      </>
      <div className="w-full flex justify-evenly">
        <Button
        
        className=" bg-[#D3FDC0] text-[#9CF456] "
        onClick={() => {
          setColoraa(
            {
              currentColor: "#D3FDC0",
              nextDat: "#EDC0FD"
             }
          )
          setcurrentview({
            service:generatedSchedule?.service?.monday,
            // tuesday:generatedSchedule.service.tuesday.filter(filt => filt.station_id === 2 ),
            // wednesday:generatedSchedule.service.wednesday.filter(filt => filt.station_id === 3 ),
            // thursday:generatedSchedule.service.thursday.filter(filt => filt.station_id === 4 ),
            // friday:generatedSchedule.service.friday.filter(filt => filt.station_id === 5 ),
            // saturday:generatedSchedule.service.saturday.filter(filt => filt.station_id === 6 ),
            // sunday:generatedSchedule.service.sunday.filter(filt => filt.station_id === 7 ),
            
            production:generatedSchedule?.production?.monday,
            // tuesday:generatedSchedule.production.tuesday.filter(filt => filt.station_id === 2 ),
            // wednesday:generatedSchedule.production.wednesday.filter(filt => filt.station_id === 3 ),
            // thursday:generatedSchedule.production.thursday.filter(filt => filt.station_id === 4 ),
            // friday:generatedSchedule.production.friday.filter(filt => filt.station_id === 5 ),
            // saturday:generatedSchedule.production.saturday.filter(filt => filt.station_id === 6 ),
            // sunday:generatedSchedule.production.sunday.filter(filt => filt.station_id === 7 ),
            
          })
          console.log(currentview,"lolsss")

        }}
        >Monday</Button>
        <Button

        className="  bg-[#EDC0FD] text-[#F456D1] "
         onClick={() => {
          
            setColoraa(
              {
                currentColor: "#EDC0FD",
                nextDat: " #FDEFC0"
               }
            )
          setcurrentview({
            // service:generatedSchedule?.service?.monday,
            service:generatedSchedule.service.tuesday,
            // wednesday:generatedSchedule.service.wednesday.filter(filt => filt.station_id === 3 ),
            // thursday:generatedSchedule.service.thursday.filter(filt => filt.station_id === 4 ),
            // friday:generatedSchedule.service.friday.filter(filt => filt.station_id === 5 ),
            // saturday:generatedSchedule.service.saturday.filter(filt => filt.station_id === 6 ),
            // sunday:generatedSchedule.service.sunday.filter(filt => filt.station_id === 7 ),
            
            // production:generatedSchedule?.production?.monday,
            production:generatedSchedule.production.tuesday,
            // wednesday:generatedSchedule.production.wednesday.filter(filt => filt.station_id === 3 ),
            // thursday:generatedSchedule.production.thursday.filter(filt => filt.station_id === 4 ),
            // friday:generatedSchedule.production.friday.filter(filt => filt.station_id === 5 ),
            // saturday:generatedSchedule.production.saturday.filter(filt => filt.station_id === 6 ),
            // sunday:generatedSchedule.production.sunday.filter(filt => filt.station_id === 7 ),
            
          })
          console.log(currentview,"lolsss")

        }}
        >Tuesday</Button>
        <Button

        
        className="  bg-[#FDEFC0] text-[#F4D156]"
         onClick={() => {
          setColoraa(
            {
              currentColor: "#FDEFC0",
              nextDat: "#C0DFFD"
             }
          )
          setcurrentview({
            // service:generatedSchedule?.service?.monday,
            // tuesday:generatedSchedule.service.tuesday.filter(filt => filt.station_id === 2 ),
            service:generatedSchedule.service.wednesday,
            // thursday:generatedSchedule.service.thursday.filter(filt => filt.station_id === 4 ),
            // friday:generatedSchedule.service.friday.filter(filt => filt.station_id === 5 ),
            // saturday:generatedSchedule.service.saturday.filter(filt => filt.station_id === 6 ),
            // sunday:generatedSchedule.service.sunday.filter(filt => filt.station_id === 7 ),
            
            // production:generatedSchedule?.production?.monday,
            // tuesday:generatedSchedule.production.tuesday.filter(filt => filt.station_id === 2 ),
            production:generatedSchedule.production.wednesday,
            // thursday:generatedSchedule.production.thursday.filter(filt => filt.station_id === 4 ),
            // friday:generatedSchedule.production.friday.filter(filt => filt.station_id === 5 ),
            // saturday:generatedSchedule.production.saturday.filter(filt => filt.station_id === 6 ),
            // sunday:generatedSchedule.production.sunday.filter(filt => filt.station_id === 7 ),
            
          })
          console.log(currentview,"lolsss")

        }}
        >Wednesday</Button>
        <Button 
        
        className="   bg-[#C0DFFD] text-[#56A7F4]"
         onClick={() => {

          setColoraa(
            {
              currentColor: "#C0DFFD",
              nextDat: "#C8C0FD"
             }
          )
          setcurrentview({
            // service:generatedSchedule?.service?.monday,
            // tuesday:generatedSchedule.service.tuesday.filter(filt => filt.station_id === 2 ),
            // wednesday:generatedSchedule.service.wednesday.filter(filt => filt.station_id === 3 ),
            service:generatedSchedule.service.thursday,
            // friday:generatedSchedule.service.friday.filter(filt => filt.station_id === 5 ),
            // saturday:generatedSchedule.service.saturday.filter(filt => filt.station_id === 6 ),
            // sunday:generatedSchedule.service.sunday.filter(filt => filt.station_id === 7 ),
            
            // production:generatedSchedule?.production?.monday,
            // tuesday:generatedSchedule.production.tuesday.filter(filt => filt.station_id === 2 ),
            // wednesday:generatedSchedule.production.wednesday.filter(filt => filt.station_id === 3 ),
            production:generatedSchedule.production.thursday,
            // friday:generatedSchedule.production.friday.filter(filt => filt.station_id === 5 ),
            // saturday:generatedSchedule.production.saturday.filter(filt => filt.station_id === 6 ),
            // sunday:generatedSchedule.production.sunday.filter(filt => filt.station_id === 7 ),
            
          })
          console.log(currentview,"lolsss")

        }}
        >Thursday</Button>
        <Button 

        
        
className=" bg-[#C8C0FD] text-[#5666F4]"
        
        onClick={() => {
          setColoraa(
            {
              currentColor: "#C8C0FD",
              nextDat: "#FDEFC0"
             }
          )
          setcurrentview({
            // service:generatedSchedule?.service?.monday,
            // tuesday:generatedSchedule.service.tuesday.filter(filt => filt.station_id === 2 ),
            // wednesday:generatedSchedule.service.wednesday.filter(filt => filt.station_id === 3 ),
            // thursday:generatedSchedule.service.thursday.filter(filt => filt.station_id === 4 ),
            service:generatedSchedule.service.friday,
            // saturday:generatedSchedule.service.saturday.filter(filt => filt.station_id === 6 ),
            // sunday:generatedSchedule.service.sunday.filter(filt => filt.station_id === 7 ),
            
            // production:generatedSchedule?.production?.monday,
            // tuesday:generatedSchedule.production.tuesday.filter(filt => filt.station_id === 2 ),
            // wednesday:generatedSchedule.production.wednesday.filter(filt => filt.station_id === 3 ),
            // thursday:generatedSchedule.production.thursday.filter(filt => filt.station_id === 4 ),
            production:generatedSchedule.production.friday,
            // saturday:generatedSchedule.production.saturday.filter(filt => filt.station_id === 6 ),
            // sunday:generatedSchedule.production.sunday.filter(filt => filt.station_id === 7 ),
            
          })
          console.log(currentview,"lolsss")
        }
      
      }
        >Friday</Button>
        <Button
        
        
        className="  bg-[#FDEFC0] text-[#F4D156]"
        onClick={() => {

          setColoraa(
            {
              currentColor: "#FDEFC0",
              nextDat: "#C0DFFD"
             }
          )
          setcurrentview({
            // service:generatedSchedule?.service?.monday,
            // tuesday:generatedSchedule.service.tuesday.filter(filt => filt.station_id === 2 ),
            // wednesday:generatedSchedule.service.wednesday.filter(filt => filt.station_id === 3 ),
            // thursday:generatedSchedule.service.thursday.filter(filt => filt.station_id === 4 ),
            // friday:generatedSchedule.service.friday.filter(filt => filt.station_id === 5 ),
            service:generatedSchedule.service.saturday,
            // sunday:generatedSchedule.service.sunday.filter(filt => filt.station_id === 7 ),
            
            // production:generatedSchedule?.production?.monday,
            // tuesday:generatedSchedule.production.tuesday.filter(filt => filt.station_id === 2 ),
            // wednesday:generatedSchedule.production.wednesday.filter(filt => filt.station_id === 3 ),
            // thursday:generatedSchedule.production.thursday.filter(filt => filt.station_id === 4 ),
            // friday:generatedSchedule.production.friday.filter(filt => filt.station_id === 5 ),
            production:generatedSchedule.production.saturday,
            // sunday:generatedSchedule.production.sunday.filter(filt => filt.station_id === 7 ),
            
          })
          console.log(currentview,"lolsss")

        }}
        >Saturday</Button>
        <Button
        
        
        className="  bg-[#C0DFFD] text-[#56A7F4]"
         onClick={() => {
          setColoraa(
            {
              currentColor: "#C0DFFD",
              nextDat: "#D3FDC0"
             }
          )
          setcurrentview({
            // service:generatedSchedule?.service?.monday,
            // tuesday:generatedSchedule.service.tuesday.filter(filt => filt.station_id === 2 ),
            // wednesday:generatedSchedule.service.wednesday.filter(filt => filt.station_id === 3 ),
            // thursday:generatedSchedule.service.thursday.filter(filt => filt.station_id === 4 ),
            // friday:generatedSchedule.service.friday.filter(filt => filt.station_id === 5 ),
            // saturday:generatedSchedule.service.saturday.filter(filt => filt.station_id === 6 ),
            service:generatedSchedule.service.sunday,
            
            // production:generatedSchedule?.production?.monday,
            // tuesday:generatedSchedule.production.tuesday.filter(filt => filt.station_id === 2 ),
            // wednesday:generatedSchedule.production.wednesday.filter(filt => filt.station_id === 3 ),
            // thursday:generatedSchedule.production.thursday.filter(filt => filt.station_id === 4 ),
            // friday:generatedSchedule.production.friday.filter(filt => filt.station_id === 5 ),
            // saturday:generatedSchedule.production.saturday.filter(filt => filt.station_id === 6 ),
            production:generatedSchedule.production.sunday,
            
          })
          console.log(currentview,"lolsss")

        }}
        
        >Sunday</Button>
      </div>
      
      <form action="#" onSubmit={submit} className="space-y-4">
        <div className="px-56 pt-6">
          {/* <div className="flex gap-4 items-center">
            <p className="font-semibold text-lg text-gray-400 w-20">Date</p>
            <div className="w-full flex flex-col gap-2">
              <div className="flex w-full justify-center items-center gap-2  p-2 rounded-lg px-5 ">
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
          </div> */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              <p className="font-semibold text-lg text-gray-400 w-20">Author</p>
              <input
                type="text"
                id="author"
                readOnly
                className="bg-transparent p-2 rounded-lg px-5 "
                defaultValue={author.name}
              />
            </div>
          </div>
        </div>







        <table className="w-full">
          <thead>
            <tr>
         <th className=" px-12"> Area</th>
         <th className=" px-3 text-nowrap"> Crew Name</th>
         <th className=" text-nowrap" > Crew ID</th>
              <th className="w-12 h-7 ">12 AM</th>
      
         {Array(11).fill(0).map((e,i) => {
          return (
            <th className="w-12 h-7 "> {i+1} </th>
          )
         })}
         <th className="w-12 h-7 "> 12 PM</th>
         {Array(11).fill(0).map((e,i) => {
          return (
            <th className="w-12 h-7 "> {i+1}</th>
          )
         })}
            </tr>
          </thead>
          <tbody>
          {/* {currentview?.service?.map((data, index) => {
            return (
              <td>{data.station_name}</td>
              <td>{data.name}</td>
              <td>{data.employee_name}</td>
            }
          ))} */}
           <tr className="h-7 font-bold">
            <td></td>
            <td></td>
            <td></td>
            <td>SERVICE</td>
          </tr>
          {  
            currentview?.service?.map((data, index) => {
              
              console.log(data.employee_name,data.available_time)
              return (
                <tr>
                   <td>{data.station_name}</td>
                    <td>{data.employee_name}</td>
                   <td className="px-5">{data?.crew_id}</td>
                  {[12,1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11].map((datas, index) => {
                    return (
                      <td  className={`w-12 h-7 text-center border border-black/10 text-transparent
                       
                      ${data.available_time[index] === 1 ?  ` bg-[${colorsa.currentColor}]`  : data.available_time[index] === 2 ?   ` bg-[${colorsa.nextDat}]`  : " "}                      `} >{data.available_time[index]}</td>
                    )
                  })}
                  
                </tr>
              )
            })
          }
          <tr className="h-7 font-bold">
            <td></td>
            <td></td>
            <td></td>
            <td>PRODUCTION</td>
          </tr>
          {
            currentview?.production?.map((data, index) => {
              let oo = 0
              return (
                <tr>
                   <td>{data.station_name}</td>
                    <td>{data.employee_name}</td>
                   <td className="px-5">{data?.crew_id}</td>
                  {[12,1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11].map((datas, index) => {
                    console.log(data)
                    return (
                      <td

               
                      
                      
                      className={`w-12 h-7 text-center border border-black/10 text-transparent
                       
                       ${data.available_time[index] === 1 ? ` bg-[${colorsa.currentColor}]` : data.available_time[index] === 2 ? ` bg-[${colorsa.nextDat}]`  : " "}

                      `} >{data.available_time[index]}</td>
                    )
                  })}
                  
                </tr>
              )
            })
          }
            <tr>
              <td>Area 1</td>
            </tr>
          </tbody>
        </table>
     
         
      </form>
    </div>

    
      
    </div>
  );
}
