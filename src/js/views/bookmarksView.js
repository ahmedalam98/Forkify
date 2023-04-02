import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it ;)';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return (
      this._data
        .map(bookmark => previewView.render(bookmark, false))
        // setting the render to false will return (array of strings(markups))
        // then we join them into one big string
        .join('')
    );
  }
}

export default new BookmarksView();
