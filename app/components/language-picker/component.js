import Ember from 'ember';
import config from 'ember-get-config';
import countries from './countries';

export default Ember.Component.extend({
    i18n: Ember.inject.service(),
    countries: countries,
    languages: Ember.computed('countries', 'i18n.locales', function () {
        const {excludeTestLocale} = config.featureFlags;
        const locales = this.get('i18n.locales').toArray();
        const countries = this.get('countries');
        const languages = [];

        for (const locale of locales) {
            if (excludeTestLocale && locale === 'test') {
                continue;
            }

            for (const country of countries) {
                for (const language of country.languages) {
                    if (language.code.startsWith(locale)) {
                        languages.push({
                            countryCode: country.code,
                            countryName: country.name,
                            name: language.name,
                            code: language.code
                        });

                        break;
                    }
                }
            }
        }

        languages.sort((a, b) => {
            if (a.countryName > b.countryName) {
                return 1;
            }

            if (a.countryName < b.countryName) {
                return -1;
            }

            return 0;
        });

        return languages;
    }),
    onPick: null,
    country: null,
    actions: {
        pickLanguage(language, code) {
            this.get('onPick')(language, code);
            this.set('i18n.locale', code);
        }
    }
});
