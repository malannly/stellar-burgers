import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getIsAuthChecked, getUser } from '../../services/profile-slice';
import { getCookie } from '../../utils/cookie';
import { useAppSelector } from '../../services/store';

export const isTokenExists = (): boolean => {
  const accessToken = getCookie('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  return Boolean(accessToken && refreshToken);
};

type ProtectedProps = {
  onlyUnAuth?: boolean;
  component: React.JSX.Element;
};

const Protected = ({
  onlyUnAuth = false,
  component
}: ProtectedProps): React.JSX.Element => {
  const user = useAppSelector(getUser);
  const isAuthChecked = useAppSelector(getIsAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return <p>Loading...</p>;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const { from } = location.state ?? { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  return component;
};

export const OnlyAuth = Protected;
export const OnlyUnAuth = ({
  component
}: {
  component: React.JSX.Element;
}): React.JSX.Element => <Protected onlyUnAuth component={component} />;
