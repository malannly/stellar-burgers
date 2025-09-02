import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { OrderCardProps } from './type';
import { TIngredient, TOrder } from '@utils-types';
import { createAsyncThunk, PayloadAction, createSlice } from '@reduxjs/toolkit';
import { OrderCardUI } from '../ui/order-card';
import { getOrdersApi } from '@api';
import { useSelector } from 'react-redux';
import { RootState } from 'src/services/store';

const maxIngredients = 6;

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

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();

  /** TODO: взять переменную из стора */
  const ingredients = useSelector(
    (state: RootState) => state.ingredients.ingredientCategory
  );

  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        const ingredient = ingredients.find(
          (ing: TIngredient) => ing._id === item
        );
        if (ingredient) return [...acc, ingredient];
        return acc;
      },
      []
    );

    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    const date = new Date(order.createdAt);
    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
