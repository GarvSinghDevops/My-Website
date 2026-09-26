const menuButton = document.querySelector('.menu-toggle');
const mainNavigation = document.querySelector('#main-nav');

menuButton.addEventListener('click', () => {
  const menuIsOpen = menuButton.getAttribute('aria-expanded') === 'true';

  menuButton.setAttribute('aria-expanded', String(!menuIsOpen));
  menuButton.setAttribute(
    'aria-label',
    menuIsOpen ? 'Open navigation' : 'Close navigation'
  );
  mainNavigation.classList.toggle('is-open', !menuIsOpen);
});

mainNavigation.addEventListener('click', event => {
  if (!event.target.closest('a')) return;

  mainNavigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
});

const yearLabel = document.querySelector('#year');
yearLabel.textContent = new Date().getFullYear();

const contactForm = document.querySelector('#contact-form');
const formStatus = contactForm.querySelector('.form-status');
const submitButton = contactForm.querySelector('[type="submit"]');

contactForm.addEventListener('submit', async event => {
  event.preventDefault();

  const originalButtonText = submitButton.innerHTML;
  formStatus.textContent = '';
  formStatus.dataset.state = '';
  submitButton.disabled = true;
  submitButton.textContent = 'Sending…';

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' }
    });
    const result = await response.json();

    if (!response.ok) {
      const errorMessages = Array.isArray(result.errors)
        ? result.errors.map(error => error.message).join(' ')
        : '';
      throw new Error(
        errorMessages || result.error || 'Please check the form and try again.'
      );
    }

    contactForm.reset();
    formStatus.textContent = 'Thanks! Your message has been sent.';
    formStatus.dataset.state = 'success';
  } catch (error) {
    formStatus.textContent =
      error.message || 'Could not send your message. Please try again.';
    formStatus.dataset.state = 'error';
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
  }
});
