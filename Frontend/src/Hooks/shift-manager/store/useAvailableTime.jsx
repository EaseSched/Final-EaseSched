import { create } from "zustand";

const useAvailableTime = create((set) => ({
  useAvailableTime: [],
  setuseAvailableTime: (newuseAvailableTime) => set({ useAvailableTime: newuseAvailableTime }),
}));

export default useAvailableTime;
