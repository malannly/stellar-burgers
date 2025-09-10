import { getFeedsApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

// async thunk
export const fetchFeeds = createAsyncThunk(
  'feed/fetchFeed',
  async (_, thunkAPI) => {
    try {
      const data = await getFeedsApi();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Ошибка загрузки');
    }
  }
);
