import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { userSlice } from './profile-slice';
import { constructorReducer } from './burger-constructor-slice';
import { categoryIngredientReducer } from './ingredeints-category-slice';
import { feedReducer } from './feed-slice';
import { orderInfoReducer } from './order-info-slice';
import { ordersReducer } from './profile-orders-slice';

export const rootReducer = combineReducers({
  feed: feedReducer,
  ingredients: categoryIngredientReducer,
  orderInfo: orderInfoReducer,
  constructorBurger: constructorReducer,
  user: userSlice.reducer,
  orders: ordersReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
