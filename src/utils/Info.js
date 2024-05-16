class Info {
  constructor() {
    this.apiKey = 'a6PuovMwB6vbNxLdZyMs2VSySfb2SqXr';
  }

  async getBtcExchangeRate() {
    try {
      const res = await fetch('https://blockchain.info/ticker');
      const btcJson = await res.json();
      const btcDisplay = document.querySelector('.btc');
      if (btcDisplay) {
        btcDisplay.innerHTML =
          `<span>USD: </span>$${btcJson.USD.buy}<span> | AUD: </span>$${btcJson.AUD.buy}<span> | BRL: </span>R$${btcJson.BRL.buy}`.replaceAll(
            '.',
            ','
          );
      } else {
        console.error('btcDisplay element not found');
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getExchangeRate() {
    try {
      const myHeaders = new Headers();
      myHeaders.append('apikey', this.apiKey);

      const requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders,
      };

      const response = await fetch(
        `https://api.apilayer.com/exchangerates_data/latest?symbols=AUD%2CUSD&base=BRL`,
        requestOptions
      );
      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const rateAUD = 1 / data.rates.AUD;
      const rateUSD = 1 / data.rates.USD;

      // Assuming .rate is a valid selector for a DOM element
      const rateElement = document.querySelector('.rate');
      if (rateElement) {
        rateElement.innerHTML = `<span>USD: </span>R$${rateUSD.toFixed(
          2
        )}<span> | AUD: </span>R$${rateAUD.toFixed(2)}`;
      } else {
        console.error('.rate element not found');
      }
    } catch (error) {
      console.log('Error: ', error);
      console.error(error);
    }
  }
}

const info = new Info();

export default info;
