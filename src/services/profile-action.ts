import { getUserApi } from '@api';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { setUser } from './profile-slice';
import { getCookie } from '../utils/cookie';

export const isTokenExists = (): boolean => {
  const accessToken = getCookie('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  return Boolean(accessToken && refreshToken);
};

export const setIsAuthChecked = createAction<boolean, 'user/setIsAuthChecked'>(
  'user/setIsAuthChecked'
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    if (isTokenExists()) {
      getUserApi()
        .then((res) => dispatch(setUser(res.user)))
        .finally(() => dispatch(setIsAuthChecked(true)));
    } else {
      dispatch(setIsAuthChecked(true));
    }
  }
);
