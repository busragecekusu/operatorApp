import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModalType } from "@/types/types";

type ActiveModalState = {
  activeModal: ModalType;
};

const initialState: ActiveModalState = {
  activeModal: null,
};

const activeModalSlice = createSlice({
  name: "activeModal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<ModalType>) => {
      state.activeModal = action.payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },
  },
});

export const { openModal, closeModal } = activeModalSlice.actions;
export default activeModalSlice.reducer;
