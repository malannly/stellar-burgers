import '../../index.css';
import styles from './app.module.css';
import { AppHeader, OrderInfo, Modal, IngredientDetails } from '@components';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  Feed,
  Login,
  ConstructorPage,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { AppDispatch } from '../../services/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchFeeds } from '../../pages/feed/feed';
import { fetchCategoryIngredients } from '../ingredients-category/ingredients-category';
import { OnlyAuth, OnlyUnAuth } from '../../pages/profile/ptotected-route';
import { checkUserAuth } from '../../pages/profile/profile-action';
import { fetchConstructor } from '../burger-constructor/burger-constructor';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchFeeds());
    dispatch(fetchCategoryIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<OnlyUnAuth component={<Login />} />} />
        <Route
          path='/register'
          element={<OnlyUnAuth component={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<OnlyUnAuth component={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<OnlyUnAuth component={<ResetPassword />} />}
        />
        <Route
          path='/profile'
          element={<OnlyUnAuth component={<Profile />} />}
        />
        <Route
          path='/profile/orders'
          element={<OnlyUnAuth component={<ProfileOrders />} />}
        />
        <Route path='*' element={<NotFound404 />} />
        <Route
          path='/feed/:number'
          element={
            <Modal title='Информация о заказе' onClose={() => navigate(-1)}>
              <OrderInfo />
            </Modal>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <Modal title='Ингридиенты' onClose={() => navigate(-1)}>
              <IngredientDetails />
            </Modal>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <Modal title='Информация о заказе' onClose={() => navigate(-1)}>
              <OrderInfo />
            </Modal>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
