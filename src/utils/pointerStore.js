import create from "zustand";

const useStorePointer = create((set) => ({
  storePointer: false,
  setUpdateStorePointer: () => {
    set({ storePointer: true });
    setTimeout(() => {
      set({ storePointer: false });
    }, 1000); // Automatically reset to false after 1 second
  },
}));

export default useStorePointer;
