import create from "zustand";

const useStoreConfig = create((set) => ({
    updateConfig: false,
    setUpdateConfig: (status) => set({ updateConfig: status }),
    resetUpdateConfig: () => set({ updateConfig: false }),
}));

export default useStoreConfig;
