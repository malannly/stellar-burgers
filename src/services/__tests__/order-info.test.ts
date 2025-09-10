import { fetchOrderInfo } from '../auth_thunks/order-info-thunk';
import { orderInfoReducer, initialState } from '../order-info-slice';
import { TOrder } from '@utils-types';
import {expect} from '@jest/globals';

describe('testing the order information', () => {
  const order: TOrder = {
    _id: '1',
    number: 1,
    name: 'orderBurger',
    status: 'done',
    ingredients: [],
    createdAt: '10:00',
    updatedAt: '11:00',
  };

  it('initial state', () => {
    expect(orderInfoReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('the request is pending', () => {
    const action = { type: fetchOrderInfo.pending.type };
    const state = orderInfoReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('the request is fulfilled', () => {
    const action = { type: fetchOrderInfo.fulfilled.type, payload: order };
    const state = orderInfoReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.orderData).toEqual(order);
  });

  it('the request is rejected', () => {
    const action = { type: fetchOrderInfo.rejected.type, payload: 'Error' };
    const state = orderInfoReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error');
  });
});
