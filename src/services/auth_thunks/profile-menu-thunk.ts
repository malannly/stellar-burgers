import { logoutApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, thunkAPI) => {
    try {
      const data = await logoutApi();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Ошибка загрузки');
    }
  }
);
