import { create } from "zustand";


const useStations = create((set) => ({
    stations: [],
    setStations: (newStations) => set({ stations: newStations }),
}));


export default useStations;