import type { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';
import {
  constructorReducer,
  initialState,
  ingredientAdd,
  ingredientRemove,
  moveIngredientUp,
  moveIngredientDown,
  closeOrder,
  fetchConstructor
} from '../burger-constructor-slice';

describe('testing the ingredients in the burger', () => {
  it('initial state', () => {
    expect(constructorReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('adding a bun', () => {
    const bun: TIngredient = {
      _id: '1',
      name: 'булка',
      type: 'bun',
      price: 100,
      image: '',
      image_mobile: '',
      image_large: '',
      calories: 100,
      carbohydrates: 100,
      proteins: 100,
      fat: 100
    };

    const state = constructorReducer(initialState, ingredientAdd(bun));
    expect(state.constructorItems.bun).toEqual(bun);
    expect(state.constructorItems.ingredients).toHaveLength(0);
  });

  it('adding a main', () => {
    const main: TIngredient = {
      _id: '2',
      name: 'начинка',
      type: 'main',
      price: 100,
      image: '',
      image_mobile: '',
      image_large: '',
      calories: 100,
      carbohydrates: 100,
      proteins: 100,
      fat: 100
    };

    const state = constructorReducer(initialState, ingredientAdd(main));
    expect(state.constructorItems.ingredients).toHaveLength(1);
    expect(state.constructorItems.ingredients[0]).toMatchObject({
      _id: '2',
      name: 'начинка',
      type: 'main'
    });
  });

  it('adding a sauce', () => {
    const main: TIngredient = {
      _id: '2',
      name: 'начинка',
      type: 'main',
      price: 100,
      image: '',
      image_mobile: '',
      image_large: '',
      calories: 100,
      carbohydrates: 100,
      proteins: 100,
      fat: 100
    };
    const sauce: TIngredient = {
      _id: '3',
      name: 'соус',
      type: 'sauce',
      price: 100,
      image: '',
      image_mobile: '',
      image_large: '',
      calories: 100,
      carbohydrates: 100,
      proteins: 100,
      fat: 100
    };

    const stateAfterMain = constructorReducer(initialState, ingredientAdd(main));
    const stateAfterSauce = constructorReducer(stateAfterMain, ingredientAdd(sauce));

    expect(stateAfterSauce.constructorItems.ingredients).toHaveLength(2);
    expect(stateAfterSauce.constructorItems.ingredients[1]).toMatchObject({
      _id: '3',
      name: 'соус',
      type: 'sauce'
    });
  });

  it('removing the ingredient by id', () => {
    const ing: TConstructorIngredient = {
      _id: '2',
      id: '3',
      name: 'начинка',
      type: 'main',
      price: 100,
      image: '',
      image_mobile: '',
      image_large: '',
      calories: 100,
      carbohydrates: 100,
      proteins: 100,
      fat: 100
    };

    const stateWithIngredient = {
      ...initialState,
      constructorItems: { bun: null, ingredients: [ing] }
    };

    const state = constructorReducer(stateWithIngredient, ingredientRemove('3'));
    expect(state.constructorItems.ingredients).toHaveLength(0);
  });

  it('moving the ingredient up', () => {
    const up: TConstructorIngredient = {
      _id: '2',
      id: 'up_id',
      name: 'начинка',
      type: 'main',
      price: 100,
      image: '',
      image_mobile: '',
      image_large: '',
      calories: 0,
      carbohydrates: 0,
      proteins: 0,
      fat: 0
    };
    const down: TConstructorIngredient = {
      _id: '3',
      id: 'down_id',
      name: 'соус',
      type: 'sauce',
      price: 100,
      image: '',
      image_mobile: '',
      image_large: '',
      calories: 0,
      carbohydrates: 0,
      proteins: 0,
      fat: 0
    };
    const stateWithIngredients = {
      ...initialState,
      constructorItems: { bun: null, ingredients: [up, down] }
    };

    const state = constructorReducer(stateWithIngredients, moveIngredientUp('down_id'));
    expect(state.constructorItems.ingredients.map(i => i.id)).toEqual(['down_id', 'up_id']);
  });

  it('moving the ingredient down', () => {
    const up: TConstructorIngredient = {
      _id: '2',
      id: 'up_id',
      name: 'начинка',
      type: 'main',
      price: 100,
      image: '',
      image_mobile: '',
      image_large: '',
      calories: 0,
      carbohydrates: 0,
      proteins: 0,
      fat: 0
    };
    const down: TConstructorIngredient = {
      _id: '3',
      id: 'down_id',
      name: 'соус',
      type: 'sauce',
      price: 100,
      image: '',
      image_mobile: '',
      image_large: '',
      calories: 0,
      carbohydrates: 0,
      proteins: 0,
      fat: 0
    };
    const stateWithIngredients = {
      ...initialState,
      constructorItems: { bun: null, ingredients: [up, down] }
    };

    const state = constructorReducer(stateWithIngredients, moveIngredientDown('up_id'));
    expect(state.constructorItems.ingredients.map(i => i.id)).toEqual(['down_id', 'up_id']);
  });

  it('close orderModal', () => {
    const stateWithOrder = {
      ...initialState,
      orderModalData: { _id: '1', name: 'order', status: 'done', number: 1 } as TOrder
    };
    const state = constructorReducer(stateWithOrder, closeOrder());
    expect(state.orderModalData).toBeNull();
  });

  it('the reuest is fulfilled', () => {
    const state = constructorReducer(initialState, { type: fetchConstructor.pending.type });
    expect(state.orderRequest).toBe(true);
    expect(state.orderModalData).toBeNull();
    expect(state.error).toBeNull();
  });

  it('the request is pending', () => {
    const order: TOrder = { _id: '1', name: 'orderBurger', status: 'done', number: 1, createdAt: '', updatedAt: '', ingredients: [] };
    const state = constructorReducer(initialState, { type: fetchConstructor.fulfilled.type, payload: { order } });
    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(order);
    expect(state.constructorItems.bun).toBeNull();
    expect(state.constructorItems.ingredients).toHaveLength(0);
  });

  it('the request is rejected', () => {
    const state = constructorReducer(initialState, { type: fetchConstructor.rejected.type, payload: 'Error' });
    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe('Error');
  });
});