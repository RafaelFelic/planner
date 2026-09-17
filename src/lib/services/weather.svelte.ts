import Cloud from '@lucide/svelte/icons/cloud';
import CloudDrizzle from '@lucide/svelte/icons/cloud-drizzle';
import CloudFog from '@lucide/svelte/icons/cloud-fog';
import CloudLightning from '@lucide/svelte/icons/cloud-lightning';
import CloudMoon from '@lucide/svelte/icons/cloud-moon';
import CloudRain from '@lucide/svelte/icons/cloud-rain';
import CloudSnow from '@lucide/svelte/icons/cloud-snow';
import CloudSun from '@lucide/svelte/icons/cloud-sun';
import Moon from '@lucide/svelte/icons/moon';
import Sun from '@lucide/svelte/icons/sun';
import type { Component } from 'svelte';

type Condition = { label: string; icon: Component; nightIcon?: Component };

type Forecast = {
	place: string;
	temperature: number;
	high: number;
	low: number;
	condition: Condition;
	isDay: boolean;
};

type Status = 'idle' | 'locating' | 'ready' | 'denied' | 'error';

const REFRESH_MS = 15 * 60 * 1000;

function describe(code: number): Condition {
	if (code === 0) return { label: 'Clear', icon: Sun, nightIcon: Moon };
	if (code <= 2) return { label: 'Partly Cloudy', icon: CloudSun, nightIcon: CloudMoon };
	if (code === 3) return { label: 'Cloudy', icon: Cloud };
	if (code <= 48) return { label: 'Fog', icon: CloudFog };
	if (code <= 57) return { label: 'Drizzle', icon: CloudDrizzle };
	if (code <= 67 || (code >= 80 && code <= 82)) return { label: 'Rain', icon: CloudRain };
	if (code <= 77 || code === 85 || code === 86) return { label: 'Snow', icon: CloudSnow };
	return { label: 'Thunderstorm', icon: CloudLightning };
}

function currentPosition() {
	return new Promise<GeolocationPosition>((resolve, reject) =>
		navigator.geolocation.getCurrentPosition(resolve, reject, { maximumAge: REFRESH_MS })
	);
}

async function fetchPlace(latitude: number, longitude: number) {
	try {
		const response = await fetch(
			`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
		);
		const data = await response.json();
		return (data.city || data.locality || data.principalSubdivision || 'Your location') as string;
	} catch {
		return 'Your location';
	}
}

async function fetchForecast(latitude: number, longitude: number) {
	const params = new URLSearchParams({
		latitude: latitude.toFixed(3),
		longitude: longitude.toFixed(3),
		current: 'temperature_2m,weather_code,is_day',
		daily: 'temperature_2m_max,temperature_2m_min',
		timezone: 'auto',
		forecast_days: '1'
	});
	const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
	if (!response.ok) throw new Error(`Weather request failed: ${response.status}`);
	return response.json();
}

class Weather {
	status = $state<Status>('idle');
	forecast = $state<Forecast | null>(null);

	get icon() {
		const condition = this.forecast?.condition;
		if (!condition) return Sun;
		return !this.forecast?.isDay && condition.nightIcon ? condition.nightIcon : condition.icon;
	}

	start() {
		this.#resume();
		const interval = setInterval(() => {
			if (this.status === 'ready') this.load();
		}, REFRESH_MS);
		return () => clearInterval(interval);
	}

	async #resume() {
		if (!('geolocation' in navigator)) {
			this.status = 'error';
			return;
		}
		try {
			const permission = await navigator.permissions.query({ name: 'geolocation' });
			if (permission.state === 'granted') await this.load();
			if (permission.state === 'denied') this.status = 'denied';
		} catch {}
	}

	async load() {
		if (!this.forecast) this.status = 'locating';
		try {
			const { coords } = await currentPosition();
			const [place, data] = await Promise.all([
				fetchPlace(coords.latitude, coords.longitude),
				fetchForecast(coords.latitude, coords.longitude)
			]);
			this.forecast = {
				place,
				temperature: Math.round(data.current.temperature_2m),
				high: Math.round(data.daily.temperature_2m_max[0]),
				low: Math.round(data.daily.temperature_2m_min[0]),
				condition: describe(data.current.weather_code),
				isDay: data.current.is_day === 1
			};
			this.status = 'ready';
		} catch (error) {
			const denied =
				error instanceof GeolocationPositionError && error.code === error.PERMISSION_DENIED;
			this.status = denied ? 'denied' : 'error';
		}
	}
}

export const weather = new Weather();
