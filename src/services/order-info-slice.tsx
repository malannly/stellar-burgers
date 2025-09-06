import { getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const fetchOrderInfo = createAsyncThunk(
  'orderInfo/fetchOrderInfo',
  async (number: number, thunkAPI) => {
    try {
      const data = await getOrderByNumberApi(number);
      return data.orders[0];
    } catch (error) {
      return thunkAPI.rejectWithValue('Ошибка загрузки');
    }
  }
);

type OrderInfoState = {
  orderData: TOrder | null;
  loading: boolean;
  error: string | null;
};

const initialState: OrderInfoState = {
  orderData: null,
  loading: false,
  error: null
};

const orderInfoSlice = createSlice({
  name: 'orderInfo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.orderData = action.payload;
      })
      .addCase(fetchOrderInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const orderInfoReducer = orderInfoSlice.reducer;
