import { resetPasswordApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const resetPasswordUser = createAsyncThunk(
  'user/resetPasswordUser',
  async (data: { password: string; token: string }, thunkAPI) => {
    try {
      return await resetPasswordApi(data);
    } catch (err) {
      return thunkAPI.rejectWithValue('Ошибка восстановлении пароля');
    }
  }
);
