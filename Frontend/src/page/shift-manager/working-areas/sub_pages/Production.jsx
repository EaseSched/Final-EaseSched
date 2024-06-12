import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import search from "../../../../assets/search.svg";
import { Paperclip, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Inactive from "../../../../assets/Inactive.svg";
import active from "../../../../assets/active.svg";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Add_employee_information from "@/components/modals/forms/add/Add_employee_information";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useQueryEmployees from "@/Hooks/shift-manager/Query/useQueryEmployees";
import uselistOfEmployeesStore from "@/Hooks/shift-manager/store/useListOfEmployeesStore";
import Modify_employee_information from "@/components/modals/forms/modify/Modify_employee_information";
import useQueryEmployeeStatus from "@/Hooks/shift-manager/Query/useQueryEmployeeStatus";
import useListOfEmployeesStatusStore from "@/Hooks/shift-manager/store/useListOfEmployeesStatusStore";
import { set } from "date-fns";
import Modify_employee_on_leave from "@/components/modals/forms/modify/Modify_employee_on_leave";
import Add_employee_on_leave from "@/components/modals/forms/add/Add_employee_on_leave";
// import Add_station_working_area from "@/components/modals/forms/add/Add_station_working_area";
// import Modify_station_working_area from "@/components/modals/forms/modify/Modify_station_working_area";
import Add_service_working_area from "@/components/modals/forms/add/Add_service_working_area";
import Modify_service_working_area from "@/components/modals/forms/modify/Modify_service_working_area";
import useStations from "@/Hooks/shift-manager/store/useStations";
import useQueryAllStation from "@/Hooks/shift-manager/Query/useQueryAllStation";
import Modify_production_working_area from "@/components/modals/forms/modify/Modify_production_working_area";
export default function Service() {
  const {
    employeeIsLoading,
    employeeIsError,
    employeError,
    employeeRefetch,
    employeeIsFetching,
  } = useQueryEmployees();
  const {
    stationData,
    stationIsLoading,
    stationIsError,
    stationRefetch,
  } = useQueryAllStation();

  const colors = [
    "#C0DFFD",
    "#D3FDC0",
    "#EDC0FD",
    "#FDEFC0",
    "#C0DFFD",
    "#C8C0FD",
    "#E2FDC0",
  ];
  const {
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
  } = useQueryEmployeeStatus();

    let stations = useStations((state) => state.stations).map(
      (f) => {
        if(f.area_name=== "Production"){

            let flattedtimes = []
    
            const friday = f?.availability?.friday?.map(element => {
              return `F:${element?.shift_start}-${element?.shift_end}`
            });
    
            const monday = f.availability.monday?.map(element => {
              return `M:${element?.shift_start}-${element?.shift_end}`
            });
            const tuesday = f.availability.tuesday?.map(element => {
              return `T:${element?.shift_start}-${element?.shift_end}`
            });
            const wednesday = f.availability.wednesday?.map(element => {
              return `W:${element?.shift_start}-${element?.shift_end}`
            });
            const thursday = f.availability.thursday?.map(element => {
              return `TH:${element?.shift_start}-${element?.shift_end}`
            });
            const saturday = f.availability.saturday?.map(element => {
              return `S:${element?.shift_start}-${element?.shift_end}`
            });
            const sunday = f.availability.sunday?.map(element => {
              return `SA:${element?.shift_start}-${element?.shift_end}`
            });
    
            flattedtimes = [...flattedtimes, ...sunday, ...saturday, ...monday, ...tuesday, ...wednesday, ...thursday, ...friday]
            
            return {
              ...f,
              flattedtimes: flattedtimes
            } 
    // end of if
    // return r
        }
        return false
      }
    
    
    );
  const [loadin, setIsloadin] = useState()


  const [filterred, setfiltered] = useState([]);
  const [items, setItem] = useState([]);
  const cvss = useRef();
    

  useEffect(() => {
    
  
       setfiltered(stations.filter(m => m !== false));
      setItem(stations.filter(m => m !== false));


      console.log(items, "items")
  
      //  const newItems =  stations?.map(it => {

      //   let flattedtimes = []

      //   const friday = it?.availability?.friday?.map(element => {
      //     return `${element?.shift_start}-${element?.shift_end}`
      //   });

      //   const monday = it.availability.monday?.map(element => {
      //     return `${element?.shift_start}-${element?.shift_end}`
      //   });
      //   const tuesday = it.availability.tuesday?.map(element => {
      //     return `${element?.shift_start}-${element?.shift_end}`
      //   });
      //   const wednesday = it.availability.wednesday?.map(element => {
      //     return `${element?.shift_start}-${element?.shift_end}`
      //   });
      //   const thursday = it.availability.thursday?.map(element => {
      //     return `${element?.shift_start}-${element?.shift_end}`
      //   });
      //   const saturday = it.availability.saturday?.map(element => {
      //     return `${element?.shift_start}-${element?.shift_end}`
      //   });
      //   const sunday = it.availability.sunday?.map(element => {
      //     return `${element?.shift_start}-${element?.shift_end}`
      //   });

      //   flattedtimes = [...flattedtimes, ...sunday, ...saturday, ...monday, ...tuesday, ...wednesday, ...thursday, ...friday]
        
      //   const r = {
      //     ...it,
      //     flattedtimes: flattedtimes
      //   } 

      //   // console.log(r, "ppppppp")
      //   return r
      //  })
       
       
      //  setfiltered(newItems) 
      //  setItem(newItems)
       
      }, [stationRefetch, stationIsLoading]);




      // console.log(items,"console ITEMSSSSSSSSSSSSSSSSS")


  const listOfEmployeesActive = useListOfEmployeesStatusStore(
    (state) => state.listOfEmployeesActive
  );

  const listOfEmployeesInctive = useListOfEmployeesStatusStore(
    (state) => state.listOfEmployeesInctive
  );

  let itemsqueryPerPage = 7;
  let maxPagesShown = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [isSuccessful, setisSuccessful] = useState({});
  const totalPages = Math.ceil(filterred?.length / itemsqueryPerPage);

  const pageRange = Math.min(totalPages, maxPagesShown);

  let startPage = Math.max(currentPage - Math.floor(pageRange / 2), 1);
  let endPage = startPage + pageRange - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - pageRange + 1, 1);
  }

  const currentItemsquery = filterred?.slice(
    (currentPage - 1) * itemsqueryPerPage,
    currentPage * itemsqueryPerPage
  );
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const [status, setstatus] = useState("All");
  useEffect(() => {
    switch (status) {
      case "All":
        setItem(stations.filter(m => m !== false));
        setfiltered(stations.filter(m => m !== false));
        break;
      case "Inactive":
        setItem(listOfEmployeesInctive);
        setfiltered(listOfEmployeesInctive);
        break;
      case "Active":
        setItem(listOfEmployeesActive);
        setfiltered(listOfEmployeesActive);
        break;
      default: 
        break;
    }
  }, [status, activeIsFetching, inactiveIsFetching, employeeIsFetching]);

  // CSV FILE READI
  const fileInput = (event) => {
    const file = event.target.files[0];

    // console.log(file);

    if (!file.type.includes("csv")) {
      cvss.current.classList.remove("hidden", "animate__fadeOut");
      setisSuccessful({
        class: "bg-red-700",
        display: " Unacceptable File type",
      });
      cvss.current.classList.add("animate__fadeIn");
      cvss.current.classList.add("flex");

      const lolsloe = setTimeout(() => {
        cvss.current.classList.replace("animate__fadeIn", "animate__fadeOut");
        cvss.current.classList.replace("flex", "hidden");
      }, 1500);

      event.target.value = null;
      return;
    }
    event.preventDefault();

    const reader = new FileReader();

    const csvquery = async (data) => {
      const fetch = await axios
        .post(
          "http://localhost:3000/csvStation/import-StationCsv",
          { data: data },
          {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((response) => {
          // console.log(response)
          setIsloadin(true);
          cvss.current.classList.remove("hidden", "animate__fadeOut");
          setisSuccessful({
            class: "bg-green-700 ",
            display: "Successfully Imported",
          });
          cvss.current.classList.add("animate__fadeIn");
          cvss.current.classList.add("flex");

          const lolsloe = setTimeout(() => {
            cvss.current.classList.replace(
              "animate__fadeIn",
              "animate__fadeOut"
            );
            cvss.current.classList.replace("flex", "hidden");
          }, 1000);
        }).catch(e => {
          console.log("error", e)
        });
    };

    reader.onload = (e) => {
      const rawCsvData = e.target.result;
      console.log(rawCsvData);
      csvquery(rawCsvData);
    };

    reader.readAsText(file);

    event.target.value = null;
  };

  const colorring = [
    "",
    " bg-[#C0DFFD] text-[#56A7F4] ",
    " bg-[#D3FDC0] text-[#9CF456]  ",
    "bg-[#EDC0FD] text-[#F456D1]  ",
    " bg-[#FDEFC0] text-[#F4D156]  ",
    "bg-[#C0DFFD] text-[#56A7F4]  ",
    " bg-[#C8C0FD] text-[#5666F4]  ",
    " bg-[#E2FDC0] text-[#AEF456]  ",
  ];
  const daysOfWeek = ["", "M", "T", "W", "Th", "F", "S", "Su"];

  const [openUser, AddUser] = useState(false);
  const [modifyUser, ModifyUser] = useState(false);
  return (
    <div className=" w-full  py-9 ">
      <span
        ref={cvss}
        className="fixed left-0 hidden  top-0 w-screen h-screen z-10 justify-center items-center text-white "
      >
        <div
          className={`flex ${isSuccessful.class} bg-opacity-90 p-20 rounded-md  flex-col justify-center items-center gap-2`}
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M53.4125 20.585L39.4125 6.585C39.0377 6.21064 38.5297 6.00025 38 6H14C12.9391 6 11.9217 6.42143 11.1716 7.17157C10.4214 7.92172 10 8.93913 10 10V28C10 28.5304 10.2107 29.0391 10.5858 29.4142C10.9609 29.7893 11.4696 30 12 30H52C52.5304 30 53.0391 29.7893 53.4142 29.4142C53.7893 29.0391 54 28.5304 54 28V22C53.9999 21.7371 53.9479 21.4768 53.8471 21.234C53.7463 20.9912 53.5986 20.7707 53.4125 20.585ZM38 22V11L49 22H38ZM12 45C12 47.75 13.795 50 16 50C16.4826 49.9892 16.958 49.8803 17.3972 49.6801C17.8364 49.4798 18.2304 49.1923 18.555 48.835C18.9235 48.4597 19.425 48.2447 19.9509 48.2364C20.4767 48.2282 20.9847 48.4275 21.3647 48.7911C21.7448 49.1547 21.9663 49.6533 21.9813 50.1791C21.9963 50.7048 21.8037 51.2153 21.445 51.6C20.7486 52.3496 19.9064 52.9492 18.9702 53.3619C18.0339 53.7746 17.0232 53.9917 16 54C11.59 54 8 49.9625 8 45C8 40.0375 11.59 36 16 36C17.0232 36.0083 18.0339 36.2254 18.9702 36.6381C19.9064 37.0508 20.7486 37.6504 21.445 38.4C21.8037 38.7847 21.9963 39.2952 21.9813 39.8209C21.9663 40.3467 21.7448 40.8453 21.3647 41.2089C20.9847 41.5725 20.4767 41.7718 19.9509 41.7636C19.425 41.7553 18.9235 41.5403 18.555 41.165C18.231 40.8069 17.8372 40.5189 17.3979 40.3185C16.9585 40.1182 16.4828 40.0098 16 40C13.795 40 12 42.25 12 45ZM37.9525 49.0775C37.8745 49.8424 37.6281 50.5806 37.2308 51.239C36.8336 51.8973 36.2954 52.4594 35.655 52.885C34.3575 53.75 32.75 54 31.2825 54C30.0007 53.9927 28.725 53.8247 27.485 53.5C26.9741 53.3571 26.5409 53.0171 26.2807 52.5549C26.0205 52.0926 25.9546 51.5459 26.0975 51.035C26.2404 50.5241 26.5804 50.0909 27.0426 49.8307C27.5049 49.5705 28.0516 49.5046 28.5625 49.6475C29.6575 49.9475 32.3 50.3225 33.45 49.5575C33.67 49.41 33.9075 49.1775 33.985 48.575C34.07 47.9075 33.805 47.55 30.79 46.6775C28.4525 46.0025 24.54 44.87 25.04 40.9C25.1183 40.1502 25.3605 39.4268 25.7493 38.781C26.1381 38.1351 26.6641 37.5826 27.29 37.1625C30.2525 35.1625 34.97 36.335 35.5 36.4725C36.0132 36.6074 36.4518 36.9407 36.7192 37.399C36.9867 37.8573 37.0612 38.4031 36.9263 38.9162C36.7913 39.4294 36.4581 39.868 35.9998 40.1355C35.5415 40.403 34.9957 40.4774 34.4825 40.3425C33.36 40.05 30.675 39.7025 29.525 40.4825C29.3747 40.5846 29.2509 40.7212 29.164 40.8807C29.077 41.0403 29.0294 41.2183 29.025 41.4C28.9975 41.625 28.9925 41.6725 29.305 41.875C29.8825 42.2475 30.9175 42.545 31.9175 42.835C34.3725 43.5425 38.5 44.75 37.9525 49.0775ZM53.8825 38.6725L48.8825 52.6725C48.7439 53.0612 48.4884 53.3974 48.1512 53.6352C47.8139 53.8729 47.4114 54.0006 46.9987 54.0006C46.5861 54.0006 46.1836 53.8729 45.8463 53.6352C45.5091 53.3974 45.2536 53.0612 45.115 52.6725L40.115 38.6725C39.9366 38.1729 39.9641 37.6229 40.1912 37.1435C40.4184 36.6641 40.8266 36.2946 41.3262 36.1162C41.8258 35.9379 42.3758 35.9653 42.8552 36.1925C43.3346 36.4196 43.7041 36.8279 43.8825 37.3275L47 46.0525L50.115 37.3275C50.2934 36.8279 50.6629 36.4196 51.1423 36.1925C51.6217 35.9653 52.1716 35.9379 52.6712 36.1162C53.1709 36.2946 53.5791 36.6641 53.8063 37.1435C54.0334 37.6229 54.0609 38.1729 53.8825 38.6725Z"
              fill="#4CA9FF"
            />
          </svg>
          <p className="font-semibold"> {isSuccessful.display}</p>
        </div>
      </span>

      <div className="bg-white rounded-md px-7 pt-7 mt-6">
        <div className="flex flex-wrap gap-3 justify-between items-center">
          {/* <div className="flex gap-2 flex-wrap">
            <div className="flex justify-center items-center  border-gray-200 border rounded-md h-7 pl-3 w-80   ">
              <img src={search} className="h-5 w-5 " alt="" />
              <Input
                placeholder="Search "
                className="border-none text-sm focus-visible:ring-none h-full"
                onChange={(e) => {
                  if (e.target.value.trim() == "") {
                    setfiltered(items);
                  }
                  setfiltered(
                    items.filter((a) => {
                      const d = a?.crew_id
                        .toString()
                        .includes(e.target.value.toLowerCase());
                      if (
                        a.name
                          .toLowerCase()
                          .includes(e.target.value.toLowerCase()) ||
                        d
                      ) {
                        return true;
                      }
                      return false;
                    })
                  );

                  // console.log(filterred);

                  setCurrentPage(1);
                }}
              />
            </div>
            <Select
              onValueChange={(e) => {
                // console.log(e);

                setstatus(e);

                setCurrentPage(1);
              }}
              defaultValue={"All"}
            >
              <SelectTrigger className="gap-3 h-7  w-fit ">
                Status: <SelectValue placeholder={"All"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="" value="All">
                  All
                </SelectItem>
                <SelectItem className="" value="Inactive">
                  Inactive
                </SelectItem>
                <SelectItem className="" value="Active">
                  active
                </SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          <div className="flex items-center gap-4">
            <div className=" w-1/2 h-full  px-2 rounded-md text-sm flex justify-center items-center gap-2  border-2 text-nowrap font-semibold border-[#009BFF] text-[#009BFF] text-center relative  ">
              <input
                type="file"
                accepts=".csv"
                className="w-28 absolute opacity-0"
                onChangeCapture={fileInput}
              />
              <p className="py-1">Import</p>
            </div>

            <Dialog
              open={openUser}
              className="text-[#4B9D58]"
              onClose={() => AddUser(false)}
            >
              <DialogTrigger
                onClick={() => AddUser(true)}
                className=" w-1/2 h-full  px-2   rounded-md text-sm flex justify-center items-center gap-2  border-2 text-nowrap font-semibold border-[#009BFF] text-[#009BFF] text-center "
              >
                <Plus size={31} />
                Add Areas
              </DialogTrigger>
              <DialogContent className="lg:w-[50%] ">
                <img
                  src={Inactive}
                  width={0}
                  height={0}
                  onLoad={(e) => {
                    e.target.parentElement.children[2].onclick = () => {
                      AddUser(false);
                    };
                  }}
                  alt=""
                />
                <DialogHeader className=" min-h-[80vh]   max-h-[80vh]    pb-16  bg-white text-center    ">
                  <DialogTitle className="text-center font-bold flex w-full justify-center">
                    ADD WORKING AREAS{" "}
                  </DialogTitle>
                  <Add_service_working_area
                    AddUser={AddUser}
                    openUser={openUser}
                  />
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div>
          <Table className="mt-5 bg-white rounded-md z-1">
            <TableHeader>
              <TableRow className="h-14 border-black text-xs">
                <TableHead>NO</TableHead>
                <TableHead>AUTHOR</TableHead>
                <TableHead>PRODUCTION</TableHead>
                <TableHead>NO. OF EMPLOYEES</TableHead>
                <TableHead>POSSIBLE SHIFT</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItemsquery.map((employee, index) => {
                console.log(employee, "inside the map")
                return (
                  <TableRow key={employee.crew_id + employee + index}>
                    {/* inAtcive => text-[#565656] */}
                    <TableCell
                      className={`
                      ${employee.status === "Inactive" ? "text-[#565656]" : ""}
                    `}
                    >
                      {filterred.indexOf(employee) + 1}{" "}
                    </TableCell>
                    <TableCell
                      className={`
                      ${employee.status === "Inactive" ? "text-[#565656]" : ""}
                    `}
                    >
                      {employee.created_by}
                    </TableCell>
                    <TableCell
                      className={`
                      ${employee.status === "Inactive" ? "text-[#565656]" : ""}
                    `}
                    >
                      {employee.station_name}
                    </TableCell>
                    <TableCell
                      className={`
                      ${employee.status === "Inactive" ? "text-[#565656]" : ""}
                    `}
                    >
                      {employee.number_of_employee}
                    </TableCell>
                    <TableCell className="flex flex-wrap gap-1 ">
                      {
                        employee.flattedtimes?.map((shift, index )=> {
                          
                          return (
                            <div className={`flex gap-2 p-1 rounded-md px-3
                            
                                ${
                                  shift.split(":")[0] === "M" ? "bg-[#9CF456]/50" 
                                  : shift.split(":")[0] === "T" ? "bg-[#F456D1]/50" 
                                  : shift.split(":")[0] === "W" ? "bg-[#F4D156]/50" 
                                  : shift.split(":")[0] === "TH" ? "bg-[#56A7F4]/50" 
                                  : shift.split(":")[0] === "F" ? "bg-[#5666F4]/50" 
                                  : shift.split(":")[0] === "S" ? "bg-[#AEF456]/50" 
                                  :shift.split(":")[0] === "SA" ? "bg-[#56A7F4]/50" 
                                  : "bg-red-500"
                                }
                            
                            `}>

                            <div >{shift}</div>
                            </div>
                          )
                        })
                      }
                      {/* {employee.possible_shifts.map((shift, index) => {
                        return (
                          <p
                            key={index}
                            className={`p-1 bg-[${
                              colors[index % colors.length]
                            }] text-xs text-center
                          } rounded-lg  px-3`}
                          >
                            {shift.start_time} - {shift.end_time}
                          </p>
                        );
                      })} */}
                    </TableCell>

                    <TableCell>
                      <Dialog
                        // open={openUsers}
                        className="text-[#4B9D58]  "
                        // onClose={() => AddUsers(false)}
                        // open={modifyUser}
                        // onClose={() => ModifyUser(false)}
                      >
                        <DialogTrigger
                          // onClick={() => AddUsers(true)}
                          className={`flex items-center hover:text-green-500 hover:fill-[#4B9D58]   space-x-1 justify-center  ${
                            employee.status === "Inactive"
                              ? "text-[#565656] fill-[#565656]"
                              : " fill-[#4B9D58] text-[#4B9D58]"
                          } `}
                          // onClick={() => ModifyUser(true)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M12 8.25C11.0054 8.25 10.0516 8.64509 9.34835 9.34835C8.64509 10.0516 8.25 11.0054 8.25 12C8.25 12.9946 8.64509 13.9484 9.34835 14.6517C10.0516 15.3549 11.0054 15.75 12 15.75C12.9946 15.75 13.9484 15.3549 14.6517 14.6517C15.3549 13.9484 15.75 12.9946 15.75 12C15.75 11.0054 15.3549 10.0516 14.6517 9.34835C13.9484 8.64509 12.9946 8.25 12 8.25ZM9.75 12C9.75 11.4033 9.98705 10.831 10.409 10.409C10.831 9.98705 11.4033 9.75 12 9.75C12.5967 9.75 13.169 9.98705 13.591 10.409C14.0129 10.831 14.25 11.4033 14.25 12C14.25 12.5967 14.0129 13.169 13.591 13.591C13.169 14.0129 12.5967 14.25 12 14.25C11.4033 14.25 10.831 14.0129 10.409 13.591C9.98705 13.169 9.75 12.5967 9.75 12Z"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M11.975 1.25C11.53 1.25 11.159 1.25 10.855 1.27C10.5443 1.28294 10.2378 1.34714 9.94799 1.46C9.61424 1.59809 9.31096 1.80057 9.05548 2.05589C8.79999 2.3112 8.5973 2.61434 8.45899 2.948C8.31399 3.298 8.27499 3.668 8.25899 4.07C8.25739 4.21702 8.21847 4.36123 8.14588 4.48909C8.07329 4.61695 7.96941 4.72428 7.84399 4.801C7.71487 4.8715 7.56995 4.90803 7.42284 4.90716C7.27573 4.90628 7.13126 4.86803 7.00299 4.796C6.64699 4.608 6.30699 4.457 5.93099 4.407C5.57293 4.3599 5.20911 4.38379 4.86028 4.4773C4.51146 4.57081 4.18447 4.73212 3.89799 4.952C3.65576 5.14688 3.4473 5.38034 3.28099 5.643C3.11099 5.897 2.92499 6.218 2.70299 6.603L2.67799 6.647C2.45499 7.032 2.26999 7.353 2.13599 7.627C1.99599 7.913 1.88599 8.195 1.84599 8.507C1.75059 9.22999 1.94627 9.96127 2.38999 10.54C2.62099 10.841 2.92199 11.06 3.26199 11.274C3.38875 11.3489 3.49436 11.4549 3.56888 11.5819C3.64341 11.7089 3.68439 11.8528 3.68799 12C3.68439 12.1472 3.64341 12.2911 3.56888 12.4181C3.49436 12.5451 3.38875 12.6511 3.26199 12.726C2.92199 12.94 2.62199 13.159 2.38999 13.46C2.17011 13.7465 2.0088 14.0735 1.91529 14.4223C1.82178 14.7711 1.79789 15.1349 1.84499 15.493C1.88599 15.805 1.99499 16.087 2.13499 16.373C2.26999 16.647 2.45499 16.968 2.67799 17.353L2.70299 17.397C2.92499 17.782 3.11099 18.103 3.28099 18.357C3.45799 18.62 3.64799 18.857 3.89799 19.047C4.1844 19.2671 4.51135 19.4285 4.86018 19.5222C5.209 19.6159 5.57287 19.64 5.93099 19.593C6.30699 19.543 6.64699 19.393 7.00299 19.204C7.13111 19.1321 7.27541 19.0939 7.42234 19.093C7.56928 19.0921 7.71402 19.1286 7.84299 19.199C7.96911 19.2751 8.07364 19.3823 8.14663 19.5102C8.21963 19.6382 8.25865 19.7827 8.25999 19.93C8.27499 20.332 8.31399 20.702 8.45999 21.052C8.59808 21.3857 8.80056 21.689 9.05588 21.9445C9.31119 22.2 9.61433 22.4027 9.94799 22.541C10.238 22.661 10.538 22.708 10.855 22.729C11.159 22.75 11.53 22.75 11.975 22.75H12.025C12.47 22.75 12.841 22.75 13.145 22.73C13.463 22.708 13.762 22.661 14.052 22.54C14.3857 22.4019 14.689 22.1994 14.9445 21.9441C15.2 21.6888 15.4027 21.3857 15.541 21.052C15.686 20.702 15.725 20.332 15.741 19.93C15.7424 19.7828 15.7813 19.6384 15.8539 19.5103C15.9265 19.3823 16.0304 19.2748 16.156 19.198C16.2852 19.1276 16.4302 19.0913 16.5773 19.0923C16.7244 19.0934 16.8688 19.1318 16.997 19.204C17.353 19.392 17.693 19.543 18.069 19.592C18.792 19.6874 19.5233 19.4917 20.102 19.048C20.352 18.856 20.542 18.62 20.719 18.357C20.889 18.103 21.075 17.782 21.297 17.397L21.322 17.353C21.545 16.968 21.73 16.647 21.864 16.373C22.004 16.087 22.114 15.804 22.154 15.493C22.2494 14.77 22.0537 14.0387 21.61 13.46C21.379 13.159 21.078 12.94 20.738 12.726C20.6112 12.6511 20.5056 12.5451 20.4311 12.4181C20.3566 12.2911 20.3156 12.1472 20.312 12C20.312 11.722 20.464 11.446 20.738 11.274C21.078 11.06 21.378 10.841 21.61 10.54C21.8299 10.2535 21.9912 9.92653 22.0847 9.5777C22.1782 9.22888 22.2021 8.86506 22.155 8.507C22.1074 8.19971 22.0094 7.90238 21.865 7.627C21.6943 7.29475 21.5132 6.96792 21.322 6.647L21.297 6.603C21.1143 6.27709 20.9216 5.95693 20.719 5.643C20.5527 5.38062 20.3442 5.14749 20.102 4.953C19.8156 4.73294 19.4886 4.57146 19.1398 4.47778C18.791 4.38409 18.4271 4.36004 18.069 4.407C17.693 4.457 17.353 4.607 16.997 4.796C16.8688 4.86786 16.7245 4.90601 16.5776 4.90688C16.4307 4.90776 16.286 4.87132 16.157 4.801C16.0312 4.72452 15.9269 4.6173 15.854 4.48942C15.781 4.36154 15.7418 4.21721 15.74 4.07C15.725 3.668 15.686 3.298 15.54 2.948C15.4019 2.61425 15.1994 2.31097 14.9441 2.05549C14.6888 1.8 14.3856 1.59731 14.052 1.459C13.762 1.339 13.462 1.292 13.145 1.271C12.841 1.25 12.47 1.25 12.025 1.25H11.975ZM10.522 2.845C10.599 2.813 10.716 2.784 10.957 2.767C11.204 2.75 11.524 2.75 12 2.75C12.476 2.75 12.796 2.75 13.043 2.767C13.284 2.784 13.401 2.813 13.478 2.845C13.785 2.972 14.028 3.215 14.155 3.522C14.195 3.618 14.228 3.769 14.241 4.126C14.271 4.918 14.68 5.681 15.406 6.1C16.132 6.52 16.997 6.492 17.698 6.122C18.014 5.955 18.161 5.908 18.265 5.895C18.5936 5.85158 18.9259 5.94043 19.189 6.142C19.255 6.193 19.339 6.28 19.474 6.48C19.613 6.686 19.773 6.963 20.011 7.375C20.249 7.787 20.408 8.065 20.517 8.287C20.624 8.504 20.657 8.62 20.667 8.703C20.7104 9.03157 20.6216 9.36392 20.42 9.627C20.356 9.71 20.242 9.814 19.94 10.004C19.268 10.426 18.812 11.162 18.812 12C18.812 12.838 19.268 13.574 19.94 13.996C20.242 14.186 20.356 14.29 20.42 14.373C20.622 14.636 20.71 14.968 20.667 15.297C20.657 15.38 20.623 15.497 20.517 15.713C20.408 15.936 20.249 16.213 20.011 16.625C19.773 17.037 19.612 17.314 19.474 17.52C19.339 17.72 19.255 17.807 19.189 17.858C18.9259 18.0596 18.5936 18.1484 18.265 18.105C18.161 18.092 18.015 18.045 17.698 17.878C16.998 17.508 16.132 17.48 15.406 17.899C14.68 18.319 14.271 19.082 14.241 19.874C14.228 20.231 14.195 20.382 14.155 20.478C14.0922 20.6298 14 20.7677 13.8839 20.8839C13.7677 21.0001 13.6298 21.0922 13.478 21.155C13.401 21.187 13.284 21.216 13.043 21.233C12.796 21.25 12.476 21.25 12 21.25C11.524 21.25 11.204 21.25 10.957 21.233C10.716 21.216 10.599 21.187 10.522 21.155C10.3702 21.0922 10.2323 21.0001 10.1161 20.8839C9.99994 20.7677 9.90781 20.6298 9.84499 20.478C9.80499 20.382 9.77199 20.231 9.75899 19.874C9.72899 19.082 9.31999 18.319 8.59399 17.9C7.86799 17.48 7.00299 17.508 6.30199 17.878C5.98599 18.045 5.83899 18.092 5.73499 18.105C5.40642 18.1484 5.07406 18.0596 4.81099 17.858C4.74499 17.807 4.66099 17.72 4.52599 17.52C4.3379 17.2272 4.15882 16.9287 3.98899 16.625C3.75099 16.213 3.59199 15.935 3.48299 15.713C3.37599 15.496 3.34299 15.38 3.33299 15.297C3.28957 14.9684 3.37842 14.6361 3.57999 14.373C3.64399 14.29 3.75799 14.186 4.05999 13.996C4.73199 13.574 5.18799 12.838 5.18799 12C5.18799 11.162 4.73199 10.426 4.05999 10.004C3.75799 9.814 3.64399 9.71 3.57999 9.627C3.37842 9.36392 3.28957 9.03157 3.33299 8.703C3.34299 8.62 3.37699 8.503 3.48299 8.287C3.59199 8.064 3.75099 7.787 3.98899 7.375C4.22699 6.963 4.38799 6.686 4.52599 6.48C4.66099 6.28 4.74499 6.193 4.81099 6.142C5.07406 5.94043 5.40642 5.85158 5.73499 5.895C5.83899 5.908 5.98499 5.955 6.30199 6.122C7.00199 6.492 7.86799 6.52 8.59399 6.1C9.31999 5.681 9.72899 4.918 9.75899 4.126C9.77199 3.769 9.80499 3.618 9.84499 3.522C9.97199 3.215 10.215 2.972 10.522 2.845Z"
                            />
                          </svg>
                          <p>Modify</p>
                        </DialogTrigger>
                        <DialogContent className="lg:w-[80%] ">
                          {/* <img
                            src={Inactive}
                            width={0}
                            height={0}
                            onLoad={(e) => {
                              e.target.parentElement.children[2].onclick =
                                () => {
                                  // AddUsers(false);
                                };
                            }}
                            alt=""
                          /> */}
                          <DialogHeader className=" min-h-[80vh]   max-h-[80vh]    pb-16  bg-white text-center    ">
                            <DialogTitle className="text-center font-bold flex w-full justify-center">
                              Modiy Working Area
                            </DialogTitle>
                            <Modify_production_working_area
                              id={employee.crew_id}
                              workingArea={employee}
                              type="Modify"
                              ModifyUser={ModifyUser}
                              openUser={openUser}

                              // AddUsers={AddUsers}
                              // openUsers={openUsers}
                            />
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="flex justify-between px-5 pt-4 text-xs">
            <div>
              shwowing {currentItemsquery?.length} out of {filterred?.length}
            </div>
            <div className="space-x-6">
              <button
                className="hover:bg-gray-600 p-2 rounded-md hover:text-white"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {startPage > 1 && (
                <React.Fragment>
                  <button
                    className="hover:bg-gray-600 w-8 h-8 rounded-md hover:text-white"
                    onClick={() => handlePageChange(1)}
                  >
                    1
                  </button>
                  {startPage > 2 && <span>...</span>}
                </React.Fragment>
              )}

              {Array.from({ length: pageRange }).map((_, index) => (
                <button
                  className="hover:bg-gray-600 w-8 h-8 rounded-md hover:text-white"
                  key={index}
                  onClick={() => handlePageChange(startPage + index)}
                >
                  {startPage + index}
                </button>
              ))}

              {endPage < totalPages - 1 && <span>...</span>}

              {endPage < totalPages && (
                <React.Fragment>
                  {endPage < totalPages && (
                    <button
                      className="hover:bg-gray-600 w-8 h-8 rounded-md hover:text-white"
                      onClick={() => handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </button>
                  )}
                </React.Fragment>
              )}

              <button
                className="hover:bg-gray-600 p-2 rounded-md hover:text-white"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
