import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { RootState } from '../../services/store';
import { loginUser } from '../login/login';
import { logoutUser } from '../../components/profile-menu/profile-menu';
import { setIsAuthChecked } from './profile-action';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
};

export const initialState: TUserState = {
  user: null,
  isAuthChecked: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(setIsAuthChecked, (state, action) => {
        state.isAuthChecked = action.payload;
      });
  }
});

export const { setUser } = userSlice.actions;

export const getUser = (state: RootState) => state.user.user;
export const getIsAuthChecked = (state: RootState) => state.user.isAuthChecked;
