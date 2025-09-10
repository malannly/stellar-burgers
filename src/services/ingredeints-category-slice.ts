import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { fetchCategoryIngredients } from './auth_thunks/ingredients-category-thunk';

type IngredientCategoryState = {
  ingredientCategory: TIngredient[];
  selectedIngredient: TIngredient | null;
  loading: boolean;
  error: string | null;
};

export const initialState: IngredientCategoryState = {
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
