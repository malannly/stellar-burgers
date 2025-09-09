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
import { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';

describe('testing the creation of the burger', () => {
  const bun: TIngredient = {
    _id: '1',
    name: 'булка',
    type: 'bun',
    price: 100,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    calories: 100,
    carbohydrates: 100,
    proteins: 100,
    fat: 100
  };

  const mainIngredient: TIngredient = {
    _id: '2',
    name: 'начинка',
    type: 'main',
    price: 100,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
    calories: 100,
    carbohydrates: 100,
    proteins: 100,
    fat: 100
  };

    const sauceIngredient: TIngredient = {
    _id: '3',
    name: 'соус',
    type: 'sauce',
    price: 100,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
    calories: 100,
    carbohydrates: 100,
    proteins: 100,
    fat: 100
  };

  it('if the request is pending', () => {
    const action = { type: fetchConstructor.pending.type };
    const state = constructorReducer(initialState, action);

    expect(state.orderRequest).toBe(true);
    expect(state.orderModalData).toBeNull();
    expect(state.error).toBeNull();
  });

  it('fulfilled the request', () => {
    const order: TOrder = { number: 123, ingredients: [],
      _id: '3', status: 'done', name: 'testOrder', createdAt: '', updatedAt: '' };
    const action = { type: fetchConstructor.fulfilled.type, payload: { order } };
    const state = constructorReducer(initialState, action);

    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(order);
    expect(state.constructorItems.bun).toBeNull();
    expect(state.constructorItems.ingredients).toHaveLength(0);
  });

  it('if the request is rejected', () => {
    const action = { type: fetchConstructor.rejected.type, payload: 'Error' };
    const state = constructorReducer(initialState, action);

    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe('Error');
  });

  it('adding a bun', () => {
    const state = constructorReducer(initialState, ingredientAdd(bun));
    expect(state.constructorItems.bun).toEqual(bun);
    expect(state.constructorItems.ingredients).toHaveLength(0);
  });

  it('adding a main', () => {
    const state = constructorReducer(initialState, ingredientAdd(mainIngredient));
    expect(state.constructorItems.ingredients).toHaveLength(1);
    expect(state.constructorItems.ingredients[0].name).toBe('начинка');
  });

  it('adding a sauce', () => {
    const stateWithMain = constructorReducer(initialState, ingredientAdd(mainIngredient));
    const state = constructorReducer(stateWithMain, ingredientAdd(sauceIngredient));

    expect(state.constructorItems.ingredients).toHaveLength(2);
    expect(state.constructorItems.ingredients[1].name).toBe('соус');
  });


it('removing the ingredient by id', () => {
  const stateAfterAdd = constructorReducer(initialState, ingredientAdd(mainIngredient));
  const addedId = stateAfterAdd.constructorItems.ingredients[0].id;
  const stateAfterRemove = constructorReducer(stateAfterAdd, ingredientRemove(addedId));

  expect(stateAfterRemove.constructorItems.ingredients).toHaveLength(0);
});


  it('moving the ingredient up', () => {
    const ingredientUp = { ...mainIngredient, id: '1' } as TConstructorIngredient;
    const ingredinDown = { ...mainIngredient, id: '2' } as TConstructorIngredient;
    const stateWithIngredients = {
      ...initialState,
      constructorItems: { bun: null, ingredients: [ingredientUp, ingredinDown] }
    };
    const state = constructorReducer(stateWithIngredients, moveIngredientUp('2'));
    expect(state.constructorItems.ingredients.map(i => i.id)).toEqual(['2', '1']);
  });

  it('moving the ingredient down', () => {
    const ingredientUp = { ...mainIngredient, id: '1' } as TConstructorIngredient;
    const ingredintDown = { ...mainIngredient, id: '2' } as TConstructorIngredient;
    const stateWithIngredients = {
      ...initialState,
      constructorItems: { bun: null, ingredients: [ingredientUp, ingredintDown] }
    };
    const state = constructorReducer(stateWithIngredients, moveIngredientDown('1'));
    expect(state.constructorItems.ingredients.map(i => i.id)).toEqual(['2', '1']);
  });

  it('closing the order', () => {
    const stateWithOrder = { ...initialState, orderModalData:
      { number: 1,
        ingredients: [],
        _id: '3',
        status: 'done',
        name: 'testOrder',
        createdAt: '',
        updatedAt: '' } };
    const state = constructorReducer(stateWithOrder, closeOrder());
    expect(state.orderModalData).toBeNull();
  });
});
