import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../services/store';
import { getOrdersApi } from '@api';
import { ProfileOrdersUI } from '@ui-pages';

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

export const ProfileOrders: FC = () => {
  const orders = useSelector((state: RootState) => state.orders.orders);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    getOrdersApi().then((data) => dispatch(setUserOrders(data)));
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
