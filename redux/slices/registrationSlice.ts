import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RegistrationState {
  email: string;
}

const initialState: RegistrationState = {
  email: "",
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    setRegistrationEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    clearRegistrationData: (state) => {
      state.email = "";
    },
  },
});

export const { setRegistrationEmail, clearRegistrationData } =
  registrationSlice.actions;
export default registrationSlice.reducer;
