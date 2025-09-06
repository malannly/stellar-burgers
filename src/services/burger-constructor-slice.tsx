import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { v4 as uuid } from 'uuid';

export const fetchConstructor = createAsyncThunk(
  'constructorBurger/fetchConstructorBurger',
  async (ingredients: string[]) => orderBurgerApi(ingredients)
);

type OrderState = {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  loading: boolean;
  error: string | null;
};

const initialState: OrderState = {
  constructorItems: { bun: null, ingredients: [] },
  orderRequest: false,
  orderModalData: null,
  loading: false,
  error: null
};

const constructorSlice = createSlice({
  name: 'constructorBurger',
  initialState,
  reducers: {
    closeOrder(state) {
      state.orderModalData = null;
    },
    ingredientAdd: {
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      },
      prepare(ingredient: TIngredient) {
        if (ingredient.type === 'bun') {
          return { payload: ingredient as TConstructorIngredient };
        }
        return {
          payload: {
            ...ingredient,
            id: uuid()
          } as TConstructorIngredient
        };
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
          state.constructorItems.ingredients[index + 1],
          state.constructorItems.ingredients[index]
        ] = [
          state.constructorItems.ingredients[index],
          state.constructorItems.ingredients[index + 1]
        ];
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConstructor.pending, (state) => {
        state.orderRequest = true;
        state.orderModalData = null;
        state.error = null;
      })
      .addCase(fetchConstructor.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.constructorItems.bun = null;
        state.constructorItems.ingredients = [];
      })
      .addCase(fetchConstructor.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  ingredientAdd,
  ingredientRemove,
  moveIngredientDown,
  moveIngredientUp,
  closeOrder
} = constructorSlice.actions;
export const constructorReducer = constructorSlice.reducer;
