import { Injectable, signal } from '@angular/core';
import { Locale } from './site-content';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  readonly exchangeRate = signal<number>(1.0);
  private currentLocale: Locale = 'en';

  defaultRateFor(locale: Locale): number {
    switch (locale) {
      case 'pl':
        return 3.92;
      case 'it':
      case 'de':
      case 'fr':
      case 'es':
        return 0.894;
      case 'uk':
        return 44.95;
      default:
        return 1.0;
    }
  }

  init(locale: Locale): void {
    this.currentLocale = locale;
    this.exchangeRate.set(this.defaultRateFor(locale));

    if (typeof window === 'undefined') return;

    if (locale === 'pl') {
      fetch('https://api.nbp.pl/api/exchangerates/rates/a/usd/?format=json')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          const rate = data?.rates?.[0]?.mid;
          if (typeof rate === 'number' && rate > 0) {
            this.exchangeRate.set(rate);
          }
        })
        .catch(() => {});
    } else if (['it', 'de', 'fr', 'es'].includes(locale)) {
      fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=EUR')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          const rate = data?.rates?.EUR;
          if (typeof rate === 'number' && rate > 0) {
            this.exchangeRate.set(rate);
          }
        })
        .catch(() => {});
    } else if (locale === 'uk') {
      fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=USD&json')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          const rate = Array.isArray(data) ? data[0]?.rate : null;
          if (typeof rate === 'number' && rate > 0) {
            this.exchangeRate.set(rate);
          }
        })
        .catch(() => {});
    }
  }

  getApproxPrice(usdPriceStr: string, locale: Locale = this.currentLocale): string {
    const num = parseFloat(usdPriceStr.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return '';

    const rate = this.exchangeRate();

    if (locale === 'pl') {
      const pln = Math.round(num * rate);
      return `ok. ${pln} zł`;
    }

    if (['it', 'de', 'fr', 'es'].includes(locale)) {
      const eur = (num * rate).toFixed(2).replace('.', ',');
      switch (locale) {
        case 'it':
          return `ca. ${eur} €`;
        case 'de':
          return `ca. ${eur} €`;
        case 'fr':
          return `env. ${eur} €`;
        case 'es':
          return `aprox. ${eur} €`;
        default:
          return `ca. ${eur} €`;
      }
    }

    if (locale === 'uk') {
      const uah = Math.round(num * rate);
      return `~${uah} грн`;
    }

    return '';
  }

  getCurrencyNote(locale: Locale = this.currentLocale): string {
    const rate = this.exchangeRate();
    switch (locale) {
      case 'pl':
        return `* Płatność rozliczana w USD ($). Orientacyjna kwota w PLN według aktualnego średniego kursu NBP (1 USD ≈ ${rate.toFixed(2)} zł).`;
      case 'it':
        return `* Pagamento in USD ($). Importo in EUR indicativo in base al tasso di cambio ufficiale BCE (1 USD ≈ ${rate.toFixed(2).replace('.', ',')} €).`;
      case 'de':
        return `* Abrechnung in USD ($). Richtwert in EUR basierend auf offiziellem EZB-Wechselkurs (1 USD ≈ ${rate.toFixed(2).replace('.', ',')} €).`;
      case 'fr':
        return `* Facturation en USD ($). Montant en EUR indicatif selon le taux de change officiel de la BCE (1 USD ≈ ${rate.toFixed(2).replace('.', ',')} €).`;
      case 'es':
        return `* Cobro en USD ($). Importe en EUR orientativo según el tipo de cambio oficial del BCE (1 USD ≈ ${rate.toFixed(2).replace('.', ',')} €).`;
      case 'uk':
        return `* Оплата в USD ($). Орієнтовна сума в грн за офіційним курсом НБУ (1 USD ≈ ${rate.toFixed(2)} грн).`;
      default:
        return '';
    }
  }
}
