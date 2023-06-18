import en from './lang/en.json'
import fr from './lang/fr.json'
import jp from './lang/jp.json'
import de from './lang/de.json'
import it from './lang/it.json'
import es from './lang/es.json'
import pt from './lang/pt.json'
import tr from './lang/tr.json'
import nl from './lang/nl.json'
import da from './lang/da.json'
export default defineI18nConfig(() => ({
    legacy: false,
    strategy: 'prefix_except_default',
    locales: [
        {
        code: 'en',
        file: 'en'
      },
      {
        code: 'fr',
        file: 'fr'
      },
      {
        code: 'jp',
        file: 'jp'
      },
      {
        code: 'de',
        file: 'de'
      },
      {
        code: 'it',
        file: 'it'
      },
      {
        code: 'es',
        file: 'es'
      },
      {
        code: 'pt',
        file: 'pt'
      },
      {
        code: 'tr',
        file: 'tr'
      },
      {
        code: 'nl',
        file: 'nl'
      },
      {
        code: 'da',
        file: 'da'
      }
    ],
    langDir: 'lang',
    locale: "en",
    defaultLocale: 'en',
    fallbackLocale: 'en',
    globalInjection: true,
    messages: {
      en,
      fr,
      jp,
      de,
      it,
      es,
      pt,
      tr,
      nl,
      da
    }
  }))