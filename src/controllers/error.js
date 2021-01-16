import pages from '../utils/pages.js';

const { NOT_FOUND_PAGE, SERVER_ERROR_PAGE } = pages;

export const get404 = (_req, res) => res
  .status(404)
  .render(NOT_FOUND_PAGE);

export const get500 = (_req, res) => res
  .status(500)
  .render(SERVER_ERROR_PAGE);
