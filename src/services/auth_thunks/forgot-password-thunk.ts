import { forgotPasswordApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const forgotPasswordUser = createAsyncThunk(
  'user/forgotPasswordUser',
  async (data: { email: string }, thunkAPI) => {
    try {
      return await forgotPasswordApi(data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        'Ошибка связанная с восстановления пароля'
      );
    }
  }
);
