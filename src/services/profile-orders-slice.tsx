import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type OrdersState = {
  orders: TOrder[];
};

const initialState: OrdersState = {
  orders: []
};

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
