import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Button } from '@/components/ui/button';
import { Eye, Upload } from 'lucide-react';
export default function History() {
  
    const history = [
        {
            name:"Septmeber 30, 2013",
            date_modified: "01/02/2003 10:30PM",
            created_by:"Juan Dela cruz",
        },
        {
            name:"Septmeber 30, 2013",
            date_modified: "01/02/2003 10:30PM",
            created_by:"Juan Dela cruz",
        },
        {
            name:"Septmeber 30, 2013",
            date_modified: "01/02/2003 10:30PM",
            created_by:"Juan Dela cruz",
        },
        {
            name:"Septmeber 30, 2013",
            date_modified: "01/02/2003 10:30PM",
            created_by:"Juan Dela cruz",
        },
        {
            name:"Septmeber 30, 2013",
            date_modified: "01/02/2003 10:30PM",
            created_by:"Juan Dela cruz",
        },
        {
            name:"Septmeber 30, 2013",
            date_modified: "01/02/2003 10:30PM",
            created_by:"Juan Dela cruz",
        },
        {
            name:"Septmeber 30, 2013",
            date_modified: "01/02/2003 10:30PM",
            created_by:"Juan Dela cruz",
        },
        {
            name:"Septmeber 30, 2013",
            date_modified: "01/02/2003 10:30PM",
            created_by:"Juan Dela cruz",
        },
        {
            name:"Septmeber 30, 2013",
            date_modified: "01/02/2003 10:30PM",
            created_by:"Juan Dela cruz",
        },
        {
            name:"Septmeber 30, 2013",
            date_modified: "01/02/2003 10:30PM",
            created_by:"Juan Dela cruz",
        },
        {
            name:"Septmeber 30, 2013",
            date_modified: "01/02/2003 10:30PM",
            created_by:"Juan Dela cruz",
        },
        {
            name:"Septmeber 30, 2013",
            date_modified: "01/02/2003 10:30PM",
            created_by:"Juan Dela cruz",
        },
        {
            name:"Septmeber 30, 2013",
            date_modified: "01/02/2003 10:30PM",
            created_by:"Juan Dela cruz",
        },
        {
            name:"Septmeber 30, 2013",
            date_modified: "01/02/2003 10:30PM",
            created_by:"Juan Dela cruz",
        },
        {
            name:"Septmeber 30, 2013",
            date_modified: "01/02/2003 10:30PM",
            created_by:"Juan Dela cruz",
        },
        {
            name:"Septmeber 30, 2013",
            date_modified: "01/02/2003 10:30PM",
            created_by:"Juan Dela cruz",
        },
        {
            name:"Septmeber 30, 2013",
            date_modified: "01/02/2003 10:30PM",
            created_by:"Juan Dela cruz",
        },
        {
            name:"Septmeber 30, 2013",
            date_modified: "01/02/2003 10:30PM",
            created_by:"Juan Dela cruz",
        },
        {
            name:"Septmeber 30, 2013",
            date_modified: "01/02/2003 10:30PM",
            created_by:"Juan Dela cruz",
        },
        {
            name:"February 30, 2013",
            date_modified: "01/02/2003 10:30PM",
            created_by:"Juan Dela cruz",
        },
    ]
    const [search, setSearch] = useState("")
  return (
    <div className=" w-full p-5 ">
      <div>
        <p className="text-lg font-semibold">History</p>
        <p className="text-sm text-gray-300">View Generated Schedules</p>
      </div>
      <div className="rounded-md w-full bg-white mt-4  ">
        <div className="p-4 px-6 flex gap-2">
          <div className="flex gap-4 h-7 w-fit p-1 rounded-md bg-white w-13  border border-gray-400">
            <input
              type="text"
              placeholder="Search"
              className=" px-5 text-sm w-full"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="p-5 pt-0">
          <Table className=" bg-white rounded-md z-1">
            <TableHeader>
              <TableRow className="h-14 border-black text-xs">
                <TableHead>NO</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Date Modified</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history
                .filter((filt) =>
                  filt.name.toLowerCase().includes(search.toLowerCase())
                ).map((historys, index) => {
                  return (
                    <TableRow>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell> {historys.name}</TableCell>
                      <TableCell>{historys.date_modified}</TableCell>
                      <TableCell>{historys.created_by} </TableCell>
                      <TableCell>
                        <div className="w-full flex gap-2">
                          <Button className="bg-blue-500 flex gap-2">
                            View
                            <Eye className="" size={17} />
                          </Button>
                          <Button className="bg-green-500  flex gap-2">
                            Export
                            <Upload size={17} />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
