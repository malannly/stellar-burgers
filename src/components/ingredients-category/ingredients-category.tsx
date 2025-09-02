import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { useSelector } from 'react-redux';
import { RootState } from 'src/services/store';

export const fetchCategoryIngredients = createAsyncThunk(
  'ingredients/fetchIngredientsCategory',
  async (_, thunkAPI) => {
    try {
      const data = await getIngredientsApi();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Ошибка загрузки');
    }
  }
);

type IngredientCategoryState = {
  ingredientCategory: TIngredient[];
  selectedIngredient: TIngredient | null;
  loading: boolean;
  error: string | null;
};

const initialState: IngredientCategoryState = {
  ingredientCategory: [],
  selectedIngredient: null,
  loading: false,
  error: null
};

const categoryIngredientSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setIngredientCategory(state, action: PayloadAction<TIngredient[]>) {
      state.ingredientCategory = action.payload;
    },
    setSelectedIngredient(state, action: PayloadAction<TIngredient>) {
      state.selectedIngredient = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredientCategory = action.payload;
      })
      .addCase(fetchCategoryIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setIngredientCategory, setSelectedIngredient } =
  categoryIngredientSlice.actions;
export const categoryIngredientReducer = categoryIngredientSlice.reducer;

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  /** TODO: взять переменную из стора */

  const burgerConstructor = useSelector(
    (state: RootState) => state.constructorBurger.constructorItems
  );

  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients } = burgerConstructor;
    const counters: { [key: string]: number } = {};
    ingredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });
    if (bun) counters[bun._id] = 2;
    return counters;
  }, [burgerConstructor]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
