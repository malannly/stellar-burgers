import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../services/store';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// const URL = process.env.BURGER_API_URL;

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

type FeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<TOrder[]>) {
      state.orders = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFeeds.fulfilled, (state, action) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      console.log(action.payload);
    });
  }
});

export const { setOrders } = feedSlice.actions;
export const feedReducer = feedSlice.reducer;

//component
export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector((state: RootState) => state.feed.orders);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(fetchFeeds());
      }}
    />
  );
};
