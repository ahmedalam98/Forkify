import * as model from './model.js';
import recipeView from './views/recipeView.js';

// Polyfilling
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');

///////////////////////////////////////
// 1.1 async function calling another async function
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    // Render spinner while fetching data
    recipeView.renderSpinner();
    // First API Call
    // 1) Loading Recipe
    // 1.2
    await model.loadRecipe(id);

    // 2) Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    alert(err);
  }
};

['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, controlRecipes)
);
