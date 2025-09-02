import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { RootState, useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedIngredient } from '../ingredients-category/ingredients-category';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { id } = useParams();
  const dispatch = useDispatch();

  const allIngredients = useSelector(
    (state: RootState) => state.ingredients.ingredientCategory
  );

  const ingredientData = useSelector(
    (state: RootState) => state.ingredients.selectedIngredient
  );

  useEffect(() => {
    if (id && allIngredients.length > 0) {
      const found = allIngredients.find((item) => item._id === id);
      if (found) {
        dispatch(setSelectedIngredient(found));
      }
    }
  }, [id, allIngredients, dispatch]);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
