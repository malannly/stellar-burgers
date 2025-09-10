import { loginUserApi, TLoginData } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { setCookie } from '../../utils/cookie';

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData, thunkAPI) => {
    try {
      const res = await loginUserApi(data);
      localStorage.setItem('refreshToken', res.refreshToken);
      setCookie('accessToken', res.accessToken);

      return res.user;
    } catch (error) {
      return thunkAPI.rejectWithValue('Ошибка при входе');
    }
  }
);
