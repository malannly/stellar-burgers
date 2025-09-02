import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, thunkAPI) => {
    try {
      const data = await getOrdersApi();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Ошибка загрузки');
    }
  }
);

type OrdersState = {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
};

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<TOrder[]>) {
      state.orders = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setOrders } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;

export const profileOrdersSlice = createSlice({
  name: 'ordersProfile',
  initialState,
  reducers: {
    setUserOrders: (state, action: PayloadAction<TOrder[]>) => {
      state.orders = action.payload;
    },
    addUserOrder: (state, action: PayloadAction<TOrder>) => {
      state.orders.unshift(action.payload);
    },
    clearUserOrders: (state) => {
      state.orders = [];
    }
  }
});

export const { setUserOrders, addUserOrder, clearUserOrders } =
  profileOrdersSlice.actions;
export const ordersReducer = profileOrdersSlice.reducer;

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders = useSelector((state: RootState) => state.orders.orders);

  return <ProfileOrdersUI orders={orders} />;
};
