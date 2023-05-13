import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1, // which page is displayed in recipes-results section on the left
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    // Ternary Operator: if there's a key it's saved in the object
    ...(recipe.key && { key: recipe.key }),
  };
};

// this function won't return anything it will just update the state
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    // update the state
    state.recipe = createRecipeObject(data);

    // check if the there's already a bookmarked-recipe
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    console.log(state.recipe);
  } catch (err) {
    throw err;
  }
};

// here we pass a query which is the (search-keyword) like "pizza"
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    // ex : https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);

    // data.data.recipes is an (array of recipes' data)
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    // Bug fix of not returning to page 1
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

// this isn't an async-function because the data (state) is already here
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  // each page has certain number of results so that we can divide the results so that the page doesn't be too long => this is "pagination"

  const start = (page - 1) * state.search.resultsPerPage; // 0 * 10
  const end = page * state.search.resultsPerPage; // 1 * 10

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    // changing the ingredients' quantity will change the serving by this formula :
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = oldQt * newServings / oldServings    // ex : (2 * 8 / 4) = 4
  });

  // we do this after the formula so that we can first use the old serving value in the formula
  state.recipe.servings = newServings;
};

//-------------------------------------------------------------------------------------//
//______________________________________BOOKMARKS______________________________________//
//-------------------------------------------------------------------------------------//
// save bookmarks to local storage
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // local storage
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  // local storage
  persistBookmarks();
};

// when page loads run this message to get bookmarks from local storage
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  // move it to the state object so that we can use it
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

// only for debugging
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

//-------------------------------------------------------------------------------------//
//______________________________________UPLOADING RECIPE______________________________________//
//-------------------------------------------------------------------------------------//
export const uploadRecipe = async function (newRecipe) {
  try {
    // Filtering the inputs
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // const ingArr = ing[1].replaceAll(' ', '').split(',');  // BUG : this removes space in the content-text
        const ingArr = ing[1].split(',').map(el => el.trim());

        // check if the ingrediens has 3 values seperated by (,)
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient fromat! Please use the correct format : Quantity, Unit, Description'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
