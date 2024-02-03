/* eslint-disable prettier/prettier */
// CurrencyConverter.js
import Freecurrencyapi from '@everapi/freecurrencyapi-js';

class CurrencyConverter {
  constructor(apiKey) {
    this.freecurrencyapi = new Freecurrencyapi(apiKey);
  }

  async getLatestExchangeRate(baseCurrency, targetCurrency) {
    try {
      const response = await this.freecurrencyapi.latest({
        base_currency: baseCurrency,
        currencies: targetCurrency,
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching latest exchange rates:', error);
      throw error;
    }
  }
}

export default CurrencyConverter;
