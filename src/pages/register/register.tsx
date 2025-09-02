import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { registerUserApi, TRegisterData } from '@api';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../services/store';

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData: TRegisterData, thunkAPI) => {
    try {
      return await registerUserApi(userData);
    } catch (err) {
      return thunkAPI.rejectWithValue(err || 'Ошибка регистрации');
    }
  }
);

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerUser({ email, password, name: userName }));
  };

  return (
    <RegisterUI
      errorText='Ошибка регистрации'
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
