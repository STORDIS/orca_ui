import create from 'zustand';

const useStoreLogs = create((set) => ({
  updateLog: false,
  setUpdateLog: (status) => set({ updateLog: status }),
  resetUpdateLog: () => set({ updateLog: false }),
}));

export default useStoreLogs;
