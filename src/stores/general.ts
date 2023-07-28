import { create } from "zustand";

interface GeneralStore {
  activeReplyId: string;
  toggleActiveReplyId: (id: string) => any;
}

export const useGeneralStore = create<GeneralStore>((set, get) => ({
  activeReplyId: "",
  toggleActiveReplyId: (id: string) => {
    if (get().activeReplyId === id) {
      set({ activeReplyId: "" });
    } else {
      set({ activeReplyId: id });
    }
  },
}));
