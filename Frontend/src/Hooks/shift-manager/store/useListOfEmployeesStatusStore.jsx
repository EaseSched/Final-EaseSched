import { create } from "zustand";

const useListOfEmployeesStatusStore = create((set) => ({
  listOfEmployeesActive: [],
  listOfEmployeesInctive: [],
  setlistOfEmployeesActive: (newlistOfEmployeesActive) => set({ listOfEmployeesActive: newlistOfEmployeesActive }),
  setlistOfEmployeesInctive: (newlistOfEmployeesInctive) => set({ listOfEmployeesInctive: newlistOfEmployeesInctive }),

}));

export default useListOfEmployeesStatusStore;
