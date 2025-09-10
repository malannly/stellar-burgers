import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../services/store';
import { registerUser } from '../../services/auth_thunks/register-thunk';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(
        registerUser({ email, password, name: userName })
      );
      if (registerUser.fulfilled.match(resultAction)) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Ошибка регистрации:', error);
    }
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
