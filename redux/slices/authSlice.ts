import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser } from "../../api/authApi";
import { LoginPayload, LoginResponse } from "../../types/auth";
import { saveSession, clearSession } from "@/utils/storage";
import { User } from "../../types/auth";
import { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

export const login = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const response = await loginUser(payload);
    await saveSession(response);
    return response;
  } catch (err: any) {
    console.log("Login hata detayı:", err);
    // Hata mesajını güzelleştir
    if (err.message === "Invalid credentials") {
      return rejectWithValue("Kullanıcı adı veya şifre hatalı");
    }
    if (err.response?.data?.message) {
      return rejectWithValue(err.response.data.message);
    }
    return rejectWithValue("Giriş başarısız. Lütfen tekrar deneyin.");
  }
});

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    await clearSession();
    dispatch(authSlice.actions.clearAuth());
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    setAuth: (state, action: PayloadAction<LoginResponse>) => {
      // API'den büyük harfle gelen rol değerini küçük harfe çeviriyoruz
      if (action.payload.user && action.payload.user.role) {
        action.payload.user.role = action.payload.user.role.toLowerCase();
      }
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        const { user, token } = payload;
        // API'den büyük harfle gelen rol değerini küçük harfe çeviriyoruz
        if (user && user.role) {
          user.role = user.role.toLowerCase();
        }
        state.user = user;
        state.token = token;
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { setAuth, clearError } = authSlice.actions;
export default authSlice.reducer;
