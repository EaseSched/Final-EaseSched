import useAuthStore from '@/Hooks/Authentication/useAuthStore';
import React, { useState } from 'react'
import { Calendar } from "@/components/ui/calendar";

export default function Aside_Shit_Manager() {
  const user = useAuthStore(state => state.user)
  
  const [date, setDate] = useState(new Date());
    const employeeOnleave = [
      // "John Rey Tolosa",
      // "Jayson Azuela",
      // "Joshua Mendoza",
      // "Rey John Neri",
      // "Jhon Mark Fuentes",
      // "Maria Gracia Villanueva",
      // "Lea Beldad",
      // "Ryan Louise Epis",
      // "Jayson Azuela",
      // "Joshua Mendoza",
      // "Rey John Neri",
      // "Jhon Mark Fuentes",
      // "Maria Gracia Villanueva",
      // "Lea Beldad",
      // "Ryan Louise Epis",
      // "Jayson Azuela",
      // "Joshua Mendoza",
      // "Rey John Neri",
      // "Jhon Mark Fuentes",
      // "Maria Gracia Villanueva",
      // "Lea Beldad",
      // "Ryan Louise Epis",
      // "Jayson Azuela",
      // "Joshua Mendoza",
      // "Rey John Neri",
      // "Jhon Mark Fuentes",
      // "Maria Gracia Villanueva",
      // "Lea Beldad",
      // "Ryan Louise Epis",
    ];
  return (
    <aside className="hidden  lg:block bg-white px-6 sticky top-0 h-screen p  ">
      <Calendar
        mode="single" //8,10,11,14,17
        selected={date}
        onSelect={setDate}
        className="border-b border-gray-200  "
      />
      {/* <div className='flex justify-between items-center py-3'>
              <p className="font-bold text-sm">EMPLOYEE ON LEAVE</p>
              <img src="" alt="icon" className='text-xs' />
            </div> */}
            <div className='text-sm overflow-y-auto h-72 scrollbar-thin'>
              {employeeOnleave.map((leave, index) => {
                return <p className='py-2 pb-2 border-b border-gray-200' key={leave+index}>{leave}</p>
              })}
            </div>
    </aside>
  );
}
