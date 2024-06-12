import useQueryAllStation from '@/Hooks/shift-manager/Query/useQueryAllStation'
import Main_navigation from '@/components/navigation/Main_navigation'
import Aside_Shit_Manager from '@/components/shift_manager_aside/Aside_Shit_Manager'
import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
export default function Main_shift_manager() {
  const [show, isshow] =  useState(false)
  const querydtation = useQueryAllStation()
  return (
    <div className="">
      <Main_navigation isshow={isshow} show={show} />
      <div className="flex">
        <span className={`${show ? " inline " : " hidden "}`}>
          <Aside_Shit_Manager />
        </span>
        <Outlet />
      </div>
    </div>
  );
}
