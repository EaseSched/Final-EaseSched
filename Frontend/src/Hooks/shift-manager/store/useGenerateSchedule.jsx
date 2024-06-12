import { create } from "zustand";

const useGenerateScheduleStore = create((set) => ({
  date: "",
  setDate: (newDate) => set({ date: newDate }),
  author: {},
  setAuthor: (newAuthor) => set({ author: newAuthor }),
  employeeOnLeave: [],
  setEmployeeOnLeave: (newEmployeeOnLeave) =>
    set({ employeeOnLeave: newEmployeeOnLeave }),
  isProcessing: false,
  setIsProcessing: (newIsProcessing) => set({ isProcessing: newIsProcessing }),
  isDone: false,
  setIsDone: (newIsDone) => set({ isDone: newIsDone }),
  generatedSchedule: {
    production:{
    monday:[],
    tuesday:[],
    wednesday:[],
    thursday:[],
    friday:[],
    satruday:[],
    sunday:[],
  },
    service:{
    monday:[],
    tuesday:[],
    wednesday:[],
    thursday:[],
    friday:[],
    satruday:[],
    sunday:[],
  },
  },
  setGeneratedSchedule: (newGeneratedSchedule) =>
    set({ generatedSchedule: newGeneratedSchedule }),
  
  
}));

export default useGenerateScheduleStore;