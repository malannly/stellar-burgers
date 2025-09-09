import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { setSelectedIngredient } from '../../services/ingredeints-category-slice';
import { useAppDispatch, useAppSelector } from '../../services/store';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const allIngredients = useAppSelector(
    (state) => state.ingredients.ingredientCategory
  );

  const ingredientData = useAppSelector(
    (state) => state.ingredients.selectedIngredient
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
