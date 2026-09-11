let translations = {};

const languageButtons = document.querySelectorAll('.lang-btn');
const translatableNodes = document.querySelectorAll('[data-i18n]');

async function loadTranslations() {
  try {
    const response = await fetch('translations.json');
    if (!response.ok) {
      throw new Error('Failed to load translations');
    }

    translations = await response.json();
    applyLanguage('en');
  } catch (error) {
    console.error('Translation loading failed:', error);
  }
}

function applyLanguage(lang) {
  const selected = translations[lang] || translations.en || {};

  translatableNodes.forEach((node) => {
    const key = node.getAttribute('data-i18n');
    if (selected[key]) {
      node.textContent = selected[key];
    }
  });

  document.documentElement.lang = lang;

  languageButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.lang === lang);
  });
}

languageButtons.forEach((button) => {
  button.addEventListener('click', () => applyLanguage(button.dataset.lang));
});

loadTranslations();
