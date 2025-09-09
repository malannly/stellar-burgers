import { fetchFeeds } from '../auth_thunks/feed-thunk';
import { feedReducer, initialState, setOrders } from '../feed-slice';
import { TOrder } from '@utils-types';

describe('testing the burger orders', () => {
  const orders: TOrder[] = [
    { number: 1, _id: '1', name: 'orderBurger1', status: 'done', ingredients: [], createdAt: '', updatedAt: '' },
    { number: 2, _id: '2', name: 'orderBurger2', status: 'pending', ingredients: [], createdAt: '', updatedAt: '' }
  ];

  it('the initial state', () => {
    expect(feedReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('if the order is send', () => {
    const state = feedReducer(initialState, setOrders(orders));
    expect(state.orders).toEqual(orders);
  });

  it('the request fulfilled', () => {
    const action = {
      type: fetchFeeds.fulfilled.type,
      payload: { orders, total: 29, totalToday: 19 }
    };
    const state = feedReducer(initialState, action);
    expect(state.orders).toEqual(orders);
    expect(state.total).toBe(29);
    expect(state.totalToday).toBe(19);
  });

  it('the request is pending', () => {
    const action = { type: fetchFeeds.pending.type };
    const state = feedReducer(initialState, action);
  });

  it('the request is rejected', () => {
    const action = { type: fetchFeeds.rejected.type, payload: 'Ошибка' };
    const state = feedReducer(initialState, action);
  });
});
