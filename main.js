const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  nav.classList.toggle('is-open', !isOpen);
});
nav.addEventListener('click', event => {
  if (event.target.closest('a')) {
    nav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  }
});

document.querySelector('#year').textContent = new Date().getFullYear();

const form = document.querySelector('#contact-form');
const status = form.querySelector('.form-status');
form.addEventListener('submit', async event => {
  event.preventDefault();
  const button = form.querySelector('[type="submit"]');
  const originalLabel = button.innerHTML;
  status.textContent = '';
  status.dataset.state = '';
  button.disabled = true;
  button.textContent = 'Sending…';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });
    const result = await response.json();

    if (!response.ok) {
      const details = Array.isArray(result.errors)
        ? result.errors.map(error => error.message).join(' ')
        : '';
      throw new Error(details || result.error || 'Please check the form and try again.');
    }

    form.reset();
    status.textContent = 'Thanks! Your message has been sent.';
    status.dataset.state = 'success';
  } catch (error) {
    status.textContent = error.message || 'Could not send your message. Please try again.';
    status.dataset.state = 'error';
  } finally {
    button.disabled = false;
    button.innerHTML = originalLabel;
  }
});
