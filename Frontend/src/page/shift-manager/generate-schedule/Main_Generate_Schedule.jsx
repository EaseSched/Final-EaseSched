import React from 'react'
import { Outlet } from 'react-router-dom'
import { Loader, LoaderIcon } from 'lucide-react'
import useGenerateScheduleStore from '@/Hooks/shift-manager/store/useGenerateSchedule';
import Step_3 from './sub_pages/Step_3';
export default function Main_Generate_Schedule() {
    const {
      date,
      setDate,
      author,
      setAuthor,
      employeeOnLeave,
      setEmployeeOnLeave,
      isProcessing,
      setIsProcessing,
    } = useGenerateScheduleStore();
// alert(isProcessing)
  return (
    <div className="w-full p-5">
      <div className={`p-3 pb-8 ${isProcessing ? " inline ":" hidden " }`}>
        <LoaderIcon className="mx-auto animate-spin"  />
        <p className="text-center text-xl font-semibold pt-2">
          Generating Schedule
        </p>
        <p className="text-center text-xs text-[#C2C2C2]">
          Genearting schedule...
        </p>
      </div>
      <Outlet />
    </div>
  );
}
