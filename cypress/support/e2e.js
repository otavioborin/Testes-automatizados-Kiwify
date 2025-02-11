import './commands'

if (Cypress.config('hideXHR')) {
  const app = window.top;
  if (app && !app.document.head.querySelector('[data-hide-command-log-request]')) {
    const style = app.document.createElement('style');
    style.innerHTML =
      '.command-name-request, .command-name-xhr { display: none }';
    style.setAttribute('data-hide-command-log-request', '');
    app.document.head.appendChild(style);
  }
}

// Prevent Cypress from failing tests when it encounters uncaught exceptions in the application
Cypress.on('uncaught:exception', (_err, _runnable) => {
  return false
})