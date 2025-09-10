import { logoutUser } from '../auth_thunks/profile-menu-thunk';
import { loginUser } from '../auth_thunks/user-thunk';
import { setIsAuthChecked } from '../profile-action';
import { userSlice, initialState, setUser } from '../profile-slice';
import { TUser } from '@utils-types';
import {expect} from '@jest/globals';

describe('testing user reducer', () => {
  const user: TUser = {
    email: 'testemail@gmail.com',
    name: 'user_test',
  };

  it('initial state', () => {
    expect(userSlice.reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('setting the user', () => {
    const state = userSlice.reducer(initialState, setUser(user));
    expect(state.user).toEqual(user);
  });

  it('log in user', () => {
    const action = { type: loginUser.fulfilled.type, payload: user };
    const state = userSlice.reducer(initialState, action);
    expect(state.user).toEqual(user);
    expect(state.isAuthChecked).toBe(true);
  });

  it('log out user', () => {
    const loggedInState = { ...initialState, user };
    const action = { type: logoutUser.fulfilled.type };
    const state = userSlice.reducer(loggedInState, action);
    expect(state.user).toBeNull();
  });

  it('if the user is autheticated', () => {
    const action = { type: setIsAuthChecked.type, payload: true };
    const state = userSlice.reducer(initialState, action);
    expect(state.isAuthChecked).toBe(true);
  });
});
