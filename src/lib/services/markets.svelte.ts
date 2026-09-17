const BITCOIN_REFRESH_MS = 60 * 1000;
const EXCHANGE_REFRESH_MS = 30 * 60 * 1000;

type Currency = 'USD' | 'AUD' | 'BRL';

export function formatMoney(value: number, currency: Currency, maximumFractionDigits = 2) {
	return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-AU', {
		style: 'currency',
		currency,
		currencyDisplay: 'narrowSymbol',
		maximumFractionDigits
	}).format(value);
}

class Markets {
	bitcoin = $state<Record<Currency, number> | null>(null);
	exchange = $state<{ USD: number; AUD: number; date: string } | null>(null);
	bitcoinFailed = $state(false);
	exchangeFailed = $state(false);

	async loadBitcoin() {
		try {
			const response = await fetch('https://blockchain.info/ticker');
			if (!response.ok) throw new Error(`Bitcoin request failed: ${response.status}`);
			const data = await response.json();
			this.bitcoin = { USD: data.USD.last, AUD: data.AUD.last, BRL: data.BRL.last };
			this.bitcoinFailed = false;
		} catch {
			this.bitcoinFailed = !this.bitcoin;
		}
	}

	async loadExchange() {
		try {
			const response = await fetch(
				'https://api.frankfurter.dev/v1/latest?base=BRL&symbols=USD,AUD'
			);
			if (!response.ok) throw new Error(`Exchange request failed: ${response.status}`);
			const data = await response.json();
			this.exchange = { USD: 1 / data.rates.USD, AUD: 1 / data.rates.AUD, date: data.date };
			this.exchangeFailed = false;
		} catch {
			this.exchangeFailed = !this.exchange;
		}
	}

	start() {
		this.loadBitcoin();
		this.loadExchange();
		const bitcoin = setInterval(() => this.loadBitcoin(), BITCOIN_REFRESH_MS);
		const exchange = setInterval(() => this.loadExchange(), EXCHANGE_REFRESH_MS);
		return () => {
			clearInterval(bitcoin);
			clearInterval(exchange);
		};
	}
}

export const markets = new Markets();
