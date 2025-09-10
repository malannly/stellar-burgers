import { profileOrdersSlice, initialState, setUserOrders, addUserOrder, clearUserOrders } from '../profile-orders-slice';
import { TOrder } from '@utils-types';
import {expect} from '@jest/globals';

describe('testing the profile order', () => {
  const order1: TOrder =
  { _id: '1',
    number: 1,
    name: 'order',
    status: 'done',
    createdAt: '',
    updatedAt: '',
    ingredients: [] };
  const order2: TOrder =
    { _id: '2',
    number: 2,
    name: 'order_1',
    status: 'done',
    createdAt: '',
    updatedAt: '',
    ingredients: [] };

  it('initial state', () => {
    expect(profileOrdersSlice.reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('setting the users order', () => {
    const state = profileOrdersSlice.reducer(initialState, setUserOrders([order1, order2]));
    expect(state.orders).toHaveLength(2);
    expect(state.orders[0]._id).toBe('1');
  });

  it('adding the order to the users', () => {
    const stateWithOneOrder = { ...initialState, orders: [order1] };
    const state = profileOrdersSlice.reducer(stateWithOneOrder, addUserOrder(order2));
    expect(state.orders).toHaveLength(2);
    expect(state.orders[0]._id).toBe('2');
  });

  it('removing the order in the users', () => {
    const stateWithOrders = { ...initialState, orders: [order1, order2] };
    const state = profileOrdersSlice.reducer(stateWithOrders, clearUserOrders());
    expect(state.orders).toHaveLength(0);
  });
});
