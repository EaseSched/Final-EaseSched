import { create } from "zustand";

const uselistOfEmployeesStore = create((set) => ({
  listOfEmployees: [],
  setlistOfEmployees: (newlistOfEmployees) =>{
     set({ listOfEmployees: newlistOfEmployees })
    },
}));

export default uselistOfEmployeesStore;
