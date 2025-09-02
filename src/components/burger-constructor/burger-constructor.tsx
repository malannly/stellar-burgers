import { FC, useMemo, useState } from 'react';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../services/store';
import { orderBurgerApi } from '@api';
import type { TNewOrderResponse } from '../../utils/burger-api';
import { useNavigate } from 'react-router-dom';

export const fetchConstructor = createAsyncThunk<
  TNewOrderResponse,
  string[],
  { rejectValue: string }
>(
  'constructorBurger/fetchConstructorBurger',
  async (ingredients: string[], thunkAPI) => {
    try {
      const response = await orderBurgerApi(ingredients);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue('Ошибка при оформлении заказа');
    }
  }
);

type ConstructorSliceState = {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TNewOrderResponse | null;
  constructorOrder: TOrder[];
  loading: boolean;
  error: string | null;
};

const initialState: ConstructorSliceState = {
  constructorItems: { bun: null, ingredients: [] },
  orderRequest: false,
  orderModalData: null,
  constructorOrder: [],
  loading: false,
  error: null
};

const constructorSlice = createSlice({
  name: 'constructorBurger',
  initialState,
  reducers: {
    sendOrder(state, action: PayloadAction<TOrder[]>) {
      state.constructorOrder = action.payload;
    },

    closeOrder(state) {
      state.orderModalData = null;
    },

    ingredientAdd(state, action: PayloadAction<TIngredient>) {
      if (action.payload.type === 'bun') {
        state.constructorItems.bun = action.payload;
      } else {
        const id = Math.floor(100000 + Math.random() * 900000).toString();
        state.constructorItems.ingredients.push({ ...action.payload, id });
      }
    },

    ingredientRemove(state, action: PayloadAction<string>) {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ing) => ing.id !== action.payload
        );
    },

    moveIngredientUp(state, action: PayloadAction<string>) {
      const index = state.constructorItems.ingredients.findIndex(
        (ing) => ing.id === action.payload
      );
      if (index > 0) {
        [
          state.constructorItems.ingredients[index - 1],
          state.constructorItems.ingredients[index]
        ] = [
          state.constructorItems.ingredients[index],
          state.constructorItems.ingredients[index - 1]
        ];
      }
    },

    moveIngredientDown(state, action: PayloadAction<string>) {
      const index = state.constructorItems.ingredients.findIndex(
        (ing) => ing.id === action.payload
      );
      if (
        index !== -1 &&
        index < state.constructorItems.ingredients.length - 1
      ) {
        [
          state.constructorItems.ingredients[index],
          state.constructorItems.ingredients[index + 1]
        ] = [
          state.constructorItems.ingredients[index + 1],
          state.constructorItems.ingredients[index]
        ];
      }
    },

    clearConstructor(state) {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchConstructor.pending, (state) => {
        state.orderRequest = true;
        state.orderModalData = null;
      })
      .addCase(fetchConstructor.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload as string;
      })
      .addCase(fetchConstructor.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        console.log(action.payload);
      });
  }
});

export const {
  ingredientAdd,
  ingredientRemove,
  moveIngredientDown,
  moveIngredientUp,
  closeOrder,
  clearConstructor
} = constructorSlice.actions;
export const constructorReducer = constructorSlice.reducer;

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */

  const constructorItems = useSelector(
    (state: RootState) => state.constructorBurger.constructorItems
  );

  const orderRequest = useSelector(
    (state: RootState) => state.constructorBurger.orderRequest
  );

  const orderModalData = useSelector(
    (state: RootState) => state.constructorBurger.orderModalData
  );
  console.log('orderModalData:', orderModalData);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    // const accessToken = getCookie('accessToken');
    // if (!accessToken) {
    //   navigate('/login');
    //   return;
    // }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((i) => i._id),
      constructorItems.bun._id
    ];

    dispatch(fetchConstructor(ingredientIds)).unwrap();
  };

  const [isOpen, setIsOpen] = useState(false);

  const closeOrderModal = () => {
    setIsOpen(false);
    dispatch(closeOrder());
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData?.order ?? null}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
