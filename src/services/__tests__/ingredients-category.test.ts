import { fetchCategoryIngredients } from '../auth_thunks/ingredients-category-thunk';
import {
  categoryIngredientReducer,
  initialState,
  setIngredientCategory,
  setSelectedIngredient
} from '../ingredeints-category-slice';
import { TIngredient } from '@utils-types';
import {expect} from '@jest/globals';

describe('testing the ingredients categories', () => {
  it('the request is pending', () => {
    const action = { type: fetchCategoryIngredients.pending.type };
    const state = categoryIngredientReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('the request is fulfilled', () => {
    const ingredients: TIngredient[] = [
      { _id: '1',
        name: 'булка',
        type: 'bun',
        price: 100,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
        calories: 100,
        carbohydrates: 100,
        proteins: 100,
        fat: 100 },
      { _id: '2',
        name: 'Начинка',
        type: 'main',
        price: 100,
        image: 'https://code.s3.yandex.net/react/code/meat-03.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
        calories: 100,
        carbohydrates: 100,
        proteins: 100,
        fat: 100 }
    ];

    const action = { type: fetchCategoryIngredients.fulfilled.type, payload: ingredients };
    const state = categoryIngredientReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.ingredientCategory).toEqual(ingredients);
    expect(state.error).toBeNull();
  });

  it('the request is rejected', () => {
    const action = { type: fetchCategoryIngredients.rejected.type, payload: 'Error' };
    const state = categoryIngredientReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error');
  });

  it('uploading the ingredient', () => {
    const ingredients: TIngredient[] = [
      { _id: '3',
        name: 'Соус',
        type: 'sauce',
        price: 100,
        image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
        calories: 100,
        carbohydrates: 100,
        proteins: 100,
        fat: 100 }
    ];

    const state = categoryIngredientReducer(initialState, setIngredientCategory(ingredients));
    expect(state.ingredientCategory).toEqual(ingredients);
  });

  it('uploading the selected ingredient', () => {
    const ingredient: TIngredient =
    { _id: '3',
      name: 'Соус',
      type: 'sauce',
      price: 100,
      image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
      calories: 100,
      carbohydrates: 100,
      proteins: 100,
      fat: 100 }

    const state = categoryIngredientReducer(initialState, setSelectedIngredient(ingredient));
    expect(state.selectedIngredient).toEqual(ingredient);
  });
});
