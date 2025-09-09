import { FC, useMemo, useState } from 'react';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../utils/cookie';
import { getUser } from '../../services/profile-slice';
import {
  closeOrder,
  fetchConstructor
} from '../../services/burger-constructor-slice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */

  const constructorItems = useAppSelector(
    (state) => state.constructorBurger.constructorItems
  );

  const orderRequest = useAppSelector(
    (state) => state.constructorBurger.orderRequest
  );

  const orderModalData = useAppSelector(
    (state) => state.constructorBurger.orderModalData
  );

  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const user = useAppSelector(getUser);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      navigate('/login', { replace: true });
      return;
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((i) => i._id),
      constructorItems.bun._id
    ];

    dispatch(fetchConstructor(ingredientIds));
  };

  const [isOpen, setIsOpen] = useState(false);

  const closeOrderModal = () => {
    setIsOpen(false);
    dispatch(closeOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
