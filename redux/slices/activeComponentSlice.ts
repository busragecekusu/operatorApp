import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActiveComponent } from "@/types/types"; 
import { RootState } from "@/redux/store"; 

interface ActiveComponentState {
  activeComponent: ActiveComponent;
}

const initialState: ActiveComponentState = {
  activeComponent: "login",
};

const activeComponentSlice = createSlice({
  name: "activeComponent",
  initialState,
  reducers: {
    setActiveComponent: (state, action: PayloadAction<ActiveComponent>) => {
      state.activeComponent = action.payload;
    },
    resetActiveComponent: (state) => {
      state.activeComponent = "login";
    },
  },
});

export const { setActiveComponent, resetActiveComponent } =
  activeComponentSlice.actions;

export const selectActiveComponent = (state: RootState) =>
  state.activeComponent.activeComponent;

export default activeComponentSlice.reducer;
