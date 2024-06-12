import { create } from "zustand";

const useemployeeOnLeaveStore = create((set) => ({
  employeeOnLeave: [],
  setemployeeOnLeave: (newemployeeOnLeave) =>
    set({ employeeOnLeave: newemployeeOnLeave }),
}));

export default useemployeeOnLeaveStore;
