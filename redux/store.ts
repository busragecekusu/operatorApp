import { configureStore } from "@reduxjs/toolkit";
import activeComponentReducer from "./slices/activeComponentSlice";
import activeModalReducer from "./slices/activeModalSlice";
import authReducer from "./slices/authSlice";
import registrationReducer from "./slices/registrationSlice";
import messageReducer from "./slices/messageSlice";

const store = configureStore({
  reducer: {
    activeComponent: activeComponentReducer,
    activeModal: activeModalReducer,
    auth: authReducer,
    registration: registrationReducer,
    messages: messageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
