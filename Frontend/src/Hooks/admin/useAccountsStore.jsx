import {create} from 'zustand';

const useAccountsStore = create((set) => ({
    accounts: [],
    setAccounts: (newAccounts) => set({ accounts: newAccounts }),
}));

export default useAccountsStore;