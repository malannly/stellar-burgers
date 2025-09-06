import { FC, useEffect } from 'react';
import { getOrdersApi } from '@api';
import { ProfileOrdersUI } from '@ui-pages';
import { setUserOrders } from '../../services/profile-orders-slice';
import { useAppDispatch, useAppSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  const orders = useAppSelector((state) => state.orders.orders);
  const dispatch = useAppDispatch();

  useEffect(() => {
    getOrdersApi().then((data) => dispatch(setUserOrders(data)));
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
