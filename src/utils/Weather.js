class Weather {
  constructor() {
    this.apiKey = 'e9b51dc93a75264f6144b7e638c93d8a';
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => this.showPosition(position),
        (error) => this.showError(error)
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }

  showPosition(position) {
    const lat = position.coords.latitude;
    const lgt = position.coords.longitude;
    console.log('Latitude: ' + lat + ', Longitude: ' + lgt);
    this.weather(lat, lgt);
  }

  showError(error) {
    console.log('Error: ' + error.message);
  }

  async weather(lat, lgt) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lgt}&appid=${this.apiKey}`
      );
      const data = await res.json();
      console.log(data);
      console.log(data.main.temp);

      const weat = document.querySelector('.weather');
      weat.insertAdjacentHTML(
        'beforeend',
        `${data.name} ${Math.round(
          data.main.temp - 273.15
        )}°C <img src="https://openweathermap.org/img/w/${
          data.weather[0].icon
        }.png"></img>`
      );
    } catch (error) {
      console.error(error);
    }
  }
}
const weatherApp = new Weather();

export default weatherApp;
