import store from '../store';
import { initialState as profile } from '../profile-slice';
import { initialState as feed } from '../feed-slice';
import { initialState as ingredients } from '../ingredeints-category-slice';
import { initialState as orderInfo } from '../order-info-slice';
import { initialState as constructorBurger } from '../burger-constructor-slice';
import { initialState as orders } from '../profile-orders-slice';

const initState = {
  user: profile,
  feed,
  ingredients,
  orderInfo,
  constructorBurger,
  orders,
};

describe('RootReducer test', () => {
  test('should return initial state', () => {
    const state = store.getState();
    expect(state).toEqual(initState);
  });
});
