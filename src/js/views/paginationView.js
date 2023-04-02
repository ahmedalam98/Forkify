import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // pub/sub pattern
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      // Event Delegation
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      // getting the page number from the data-attribute in the html code
      const goToPage = Number(btn.dataset.goto);
      // using (+) to convert it to a number

      //pub/sub pattern
      handler(goToPage);
    });
  }

  _generateNextPageMarkup() {
    const curPage = this._data.page;
    return `
    <button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
      <span>Page ${curPage + 1}</span>
    </button>
  `;
  }

  _generatePrevPageMarkup() {
    const curPage = this._data.page;
    return `
    <button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button>
  `;
  }

  _generateMarkup() {
    // remember => (this.data) is the argument passed through the render method => here it's : (model.state.search)

    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage //ex: number-of-pages = (50 pages / 10) = 5 pages
    );
    // senario-1 : Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateNextPageMarkup();
    }
    // senario-2 : Last page
    if (curPage === numPages && numPages > 1) {
      return this._generatePrevPageMarkup();
    }
    // senario-3 : Other page
    if (curPage < numPages) {
      return `
      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
        <span>Page ${curPage + 1}</span>
      </button>
      
      <button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
      `;
    }
    // // senario-4 : Page 1, and there are NO other pages
    return '';
  }
}
export default new PaginationView();
