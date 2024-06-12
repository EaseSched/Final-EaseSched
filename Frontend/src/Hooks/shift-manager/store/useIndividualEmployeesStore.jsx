import { create } from "zustand";

const useindividualStore = create((set) => ({
  individual: [],
  setindividual: (newindividual) => set({ individual: newindividual }),
}));

export default useindividualStore;
