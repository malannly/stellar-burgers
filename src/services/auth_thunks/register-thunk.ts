import { registerUserApi, TRegisterData } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData: TRegisterData, thunkAPI) => {
    try {
      return await registerUserApi(userData);
    } catch (err) {
      return thunkAPI.rejectWithValue(err || 'Ошибка регистрации');
    }
  }
);
