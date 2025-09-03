import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '@api';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../services/store';
import { useParams } from 'react-router-dom';

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

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const { number } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const { orderData, loading } = useSelector(
    (state: RootState) => state.orderInfo
  );
  const ingredients = useSelector(
    (state: RootState) => state.ingredients.ingredientCategory
  );

  useEffect(() => {
    if (number) {
      dispatch(fetchOrderInfo(Number(number)));
    }
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find(
            (ing: TIngredient) => ing._id === item
          );
          if (ingredient) {
            acc[item] = { ...ingredient, count: 1 };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (loading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
