import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { feedReducer } from '../pages/feed/feed';
import { orderInfoReducer } from '../components/order-info/order-info';
import { categoryIngredientReducer } from '../components/ingredients-category/ingredients-category';
import { constructorReducer } from '../components/burger-constructor/burger-constructor';
import { userSlice } from '../pages/profile/profile-slice';
import { ordersReducer } from '../pages/profile-orders/profile-orders';

//const rootReducer = () => {};  Заменить на импорт настоящего редьюсера

const rootReducer = combineReducers({
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

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
