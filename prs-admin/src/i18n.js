import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';

import en from './assets/lang/en.json';
import vi from './assets/lang/vi.json';

i18n.use(reactI18nextModule).init({
  resources: {
    en: { translation: en },
    vi: { translation: vi }
  },
  lng: 'vi',
  fallbackLng: 'vi',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
