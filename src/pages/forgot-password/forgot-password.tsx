import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordApi, TRegisterData } from '@api';
import { ForgotPasswordUI } from '@ui-pages';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const forgotPasswordUser = createAsyncThunk(
  'user/forgotPasswordUser',
  async (data: { email: string }, thunkAPI) => {
    try {
      return await forgotPasswordApi(data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        'Ошибка связанная с восстановления пароля'
      );
    }
  }
);

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    setError(null);
    forgotPasswordApi({ email })
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      })
      .catch((err) => setError(err));
  };

  return (
    <ForgotPasswordUI
      errorText={error?.message}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
