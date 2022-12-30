import { async } from 'regenerator-runtime';
import { API_URL } from './config';
import { getJSON } from './helpers';
export const state = {
  recipe: {},
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);

    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      image: recipe.image_url,
      title: recipe.title,
      publisher: recipe.publisher,
      cookingTime: recipe.cookingTime,
      servings: recipe.servings,
      ingredients: recipe.ingredients,
    };
  } catch (err) {
    // Temporary error handling
    console.error(`${err}💥💥💥`);
    throw err;
  }
};
