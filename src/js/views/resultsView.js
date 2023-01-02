import View from './View.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again';
  _sucessMessage = '';

  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join('');
  }

  _generateMarkupPreview(results) {
    const id = window.location.hash.slice(1);
    return `
      <li class="preview">
        <a class="preview__link" ${
          results.id === id ? 'preview__link--active' : ''
        } href="#${results.id}">
          <figure class="preview__fig">
            <img src="${results.image}" alt="${results.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${results.title}</h4>
            <p class="preview__publisher">${results.publisher}</p>
          </div>
        </a>
      </li>`;
  }
}

export default new ResultsView();
