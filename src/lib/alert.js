/**
 * SweetAlert2 is loaded from a CDN in index.html, so it only exists as a
 * global. Wrapping it keeps the calls lint-clean and makes sure a missing
 * CDN never breaks a page.
 */
const fire = (...args) => {
  if (window.Swal) {
    window.Swal.fire(...args);
  } else {
    console.error('[alert]', ...args);
  }
};

export const alert = {
  error: (title, text) => fire(title, text, 'error'),
  success: (title, text) => fire(title, text, 'success'),
  info: (title, text) => fire(title, text, 'info'),
  warning: (title, text) => fire(title, text, 'warning'),
  confirm: (options) => window.Swal?.fire(options),
};

export default alert;
