import stickyHeader from './utils/Header.js';
import Todolist from './components/Todolist.js';
import weatherApp from './utils/Weather.js';
import info from './utils/Info.js';
import scheduleComponent from './components/Schedule.js';

// import Notes from './components/Notes.js';

// ...importar outros componentes conforme necessário

class App {
  constructor() {
    this.date = document.querySelector('#date');
    this.clock = document.querySelector('.clock');
    // Inicializar e renderizar componentes diretamente
    this.todolist = new Todolist().render();
    // this.notes = new Notes('notes-container').render();
    // this.schedule = new Schedule('schedule-container').render();
    // ...inicializar e renderizar outros componentes conforme necessário
    stickyHeader.init();
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 1000);
    scheduleComponent.createTimeSchedule();
    // Example of how to use the methods
    info.getBtcExchangeRate();
    info.getExchangeRate();
    weatherApp.getLocation();
  }

  updateDateTime() {
    this.date.innerHTML = new Date().toLocaleString('en-AU', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    this.clock.innerHTML = new Date().toLocaleString('en-AU', {
      hour: 'numeric',
      minute: 'numeric',
    });
  }
}

const app = new App();
