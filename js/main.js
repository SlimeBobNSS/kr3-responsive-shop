const orderDialog = document.getElementById('order-dialog');
const orderButtons = document.querySelectorAll('.product-card__button');
const closeDialogButton = document.getElementById('close-order-dialog');
const selectedProductInput = document.getElementById('selected-product');
const orderForm = document.getElementById('order-form');
const successMessage = document.getElementById('success-message');

orderButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const productName = button.dataset.product;
    if (selectedProductInput) {
      selectedProductInput.value = productName;
    }
    if (successMessage) successMessage.hidden = true;
    if (orderDialog) {
      orderDialog.showModal();
    }
  });
});

if (closeDialogButton && orderDialog) {
  closeDialogButton.addEventListener('click', () => {
    orderDialog.close();
  });
}

if (orderForm) {
  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const formElements = Array.from(orderForm.elements);
    formElements.forEach((element) => {
      if (element.willValidate) {
        element.removeAttribute('aria-invalid');
      }
    });

    if (!orderForm.checkValidity()) {
      formElements.forEach((element) => {
        if (element.willValidate && !element.checkValidity()) {
          element.setAttribute('aria-invalid', 'true');
        }
      });
      orderForm.reportValidity();
      return;
    }

    if (successMessage) {
      successMessage.hidden = false;
    }
    orderForm.reset();
    if (orderDialog) {
      orderDialog.close();
    }
  });
}

const driversFilters = document.getElementById('drivers-filters');
if (driversFilters) {
  const driversGrid = document.getElementById('drivers-grid');
  const drivers = Array.from(driversGrid.querySelectorAll('.product-card'));
  const emptyMessage = document.getElementById('drivers-empty');

  const applyDriversFilters = (event) => {
    if (event) event.preventDefault();
    const engines = Array.from(driversFilters.querySelectorAll('input[name="pu"]:checked'), input => input.value);
    const status = driversFilters.querySelector('input[name="status"]:checked').value;
    const sorting = driversFilters.querySelector('select[name="sort"]').value;

    const ordered = [...drivers].sort((first, second) => {
      if (sorting === 'name-asc') {
        return first.querySelector('.product-card__title').textContent.localeCompare(
          second.querySelector('.product-card__title').textContent, 'ru'
        );
      }
      if (sorting === 'number-asc') return Number(first.dataset.number) - Number(second.dataset.number);
      return Number(second.dataset.points) - Number(first.dataset.points);
    });

    let visibleCount = 0;
    ordered.forEach(card => {
      const matchesEngine = !engines.length || engines.includes(card.dataset.pu);
      const matchesStatus = status === 'all' || card.dataset.status === status;
      const show = matchesEngine && matchesStatus;
      card.hidden = !show;
      driversGrid.appendChild(card);
      if (show) visibleCount++;
    });

    emptyMessage.hidden = visibleCount > 0;
  };

  driversFilters.addEventListener('submit', applyDriversFilters);
  applyDriversFilters();
}

for (const [formId, statusId] of [
  ['page-ticket-form', 'page-ticket-status'],
  ['contact-form', 'contact-status']
]) {
  const form = document.getElementById(formId);
  const status = document.getElementById(statusId);
  if (!form || !status) continue;
  form.addEventListener('submit', event => {
    event.preventDefault();
    status.hidden = false;
  });
  form.addEventListener('input', () => { status.hidden = true; });
  form.addEventListener('change', () => { status.hidden = true; });
}
const navToggle = document.querySelector('.site-nav-toggle');
const mobileNav = document.getElementById('mobile-site-nav');
if (navToggle && mobileNav) {
  const closeMobileNav = (restoreFocus = false) => {
    mobileNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Открыть меню');
    if (restoreFocus) navToggle.focus();
  };
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      closeMobileNav();
    } else {
      mobileNav.classList.add('is-open');
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'Закрыть меню');
    }
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => closeMobileNav());
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobileNav.classList.contains('is-open')) {
      closeMobileNav(true);
    }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) closeMobileNav();
  });
}
