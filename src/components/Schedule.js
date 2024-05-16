class Schedule {
  constructor() {
    this.calendar = document.querySelector('.calendar');
    this.settingsBtn = document.querySelector('.settings');
    this.date = document.querySelector('#current-date');
    this.calendarContainer = document.querySelector('#calendar-container');
    this.scheduleList = document.querySelector('#schedule-list');
    this.container = document.querySelector('.container');

    this.scheduleData = [];
    this.currentDate = new Date();
    this.selectedDate = null;

    this.init();

    this.calendar.addEventListener('click', (e) => this.openCalendar(e));
    this.container.addEventListener('scroll', (e) => this.handleScroll(e));
    document.addEventListener('click', (e) => this.closeCalendar(e));
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  handleResize() {
    const footer = document.querySelector('footer');
    const info = footer.querySelector('.info');
    const slideControls = document.querySelector('.slide-controls');

    if (window.innerHeight < 500) {
      slideControls.style.display = 'none';
      this.scheduleList.style.paddingBottom = '35px';
      footer.style.position = 'relative';

      if (info) {
        info.style.position = 'relative';
      }
    } else {
      slideControls.style.display = 'flex';
      this.scheduleList.style.paddingBottom = '0';
      footer.style.position = 'fixed';
      if (info) {
        info.style.position = 'fixed';
      }
    }
  }

  init() {
    this.Settings();
    this.loadDataFromLocalStorage();
    this.render();
  }

  handleScroll(e) {
    const scheduleComponent = document.querySelector('.schedule');
    let isInSchedule = false;
    const currentScrollLeft = this.container.scrollLeft;
    const componentWidth = scheduleComponent.offsetWidth;
    const scheduleStart = componentWidth;
    const scheduleEnd = scheduleStart + componentWidth - componentWidth * 0.7;

    const isCurrentlyInSchedule =
      currentScrollLeft >= scheduleStart && currentScrollLeft <= scheduleEnd;

    if (isCurrentlyInSchedule && !isInSchedule) {
      isInSchedule = true;
    }

    if (!isCurrentlyInSchedule && isInSchedule) {
      console.log('init');
      this.init(e);
      isInSchedule = false;
    }
  }
  init() {
    this.Settings();
    this.loadDataFromLocalStorage();
    this.render();
  }

  handleScroll(e) {
    const scheduleComponent = document.querySelector('.schedule');
    let isInSchedule = false;
    const currentScrollLeft = this.container.scrollLeft;
    const componentWidth = scheduleComponent.offsetWidth;
    const scheduleStart = componentWidth;
    const scheduleEnd = scheduleStart + componentWidth - componentWidth * 0.7;

    const isCurrentlyInSchedule =
      currentScrollLeft >= scheduleStart && currentScrollLeft <= scheduleEnd;

    if (isCurrentlyInSchedule && !isInSchedule) {
      isInSchedule = true;
    }

    if (!isCurrentlyInSchedule && isInSchedule) {
      console.log('init');
      this.init(e);
      isInSchedule = false;
    }
  }

  render() {
    this.clearTimeSchedule();
    for (let hour = 5; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`;
        const listItem = document.createElement('li');
        const input = document.createElement('input');
        input.type = 'text';
        input.id = this.generateId(hour, minute);

        input.addEventListener('change', () =>
          this.updateScheduleData(input.value, input.id)
        );
        input.addEventListener('blur', () =>
          this.updateScheduleData(input.value, input.id)
        );

        const existingEntry = this.scheduleData.find(
          (entry) => entry.id === input.id
        );
        if (existingEntry) {
          input.value = existingEntry.value;
        }

        listItem.appendChild(document.createTextNode(time + ' - '));
        listItem.appendChild(input);
        this.scheduleList.appendChild(listItem);
      }
    }
    this.date.innerHTML = this.currentDate.toLocaleDateString('en-AU');
  }

  generateId(hour, minute) {
    return `${hour.toString().padStart(2, '0')}${minute
      .toString()
      .padStart(2, '0')}${this.currentDate
      .getDate()
      .toString()
      .padStart(2, '0')}${(this.currentDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${this.currentDate.getFullYear()}`;
  }

  updateScheduleData(value, id) {
    const trimmedValue = value.trim();
    const existingEntryIndex = this.scheduleData.findIndex(
      (entry) => entry.id === id
    );

    if (trimmedValue) {
      if (existingEntryIndex !== -1) {
        this.scheduleData[existingEntryIndex].value = trimmedValue;
      } else {
        this.scheduleData.push({ id, value: trimmedValue });
      }
    } else if (existingEntryIndex !== -1) {
      this.scheduleData.splice(existingEntryIndex, 1);
    }
    this.saveToLocalStorage();
  }

  createCalendar() {
    this.calendarContainer.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'calendar-header';

    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = ' &#9664; ';
    prevBtn.addEventListener('click', (event) => this.changeMonth(-1, event));

    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = ' &#9654; ';
    nextBtn.addEventListener('click', (event) => this.changeMonth(1, event));

    const monthDisplay = document.createElement('span');
    monthDisplay.textContent = this.currentDate.toLocaleDateString('en-AU', {
      month: 'long',
      year: 'numeric',
    });

    header.appendChild(prevBtn);
    header.appendChild(monthDisplay);
    header.appendChild(nextBtn);

    this.calendarContainer.appendChild(header);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daysContainer = document.createElement('div');
    daysContainer.className = 'calendar-days';

    daysOfWeek.forEach((day) => {
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-weekday';
      dayElement.textContent = day;
      daysContainer.appendChild(dayElement);
    });

    this.calendarContainer.appendChild(daysContainer);

    const firstDayOfMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1
    ).getDay();
    for (let i = 0; i < firstDayOfMonth; i++) {
      const spacer = document.createElement('div');
      spacer.className = 'calendar-day empty';
      daysContainer.appendChild(spacer);
    }

    const daysInMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      0
    ).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-day';
      dayElement.textContent = day;

      // Highlight the current date
      const today = new Date();
      if (
        day === today.getDate() &&
        this.currentDate.getMonth() === today.getMonth() &&
        this.currentDate.getFullYear() === today.getFullYear()
      ) {
        dayElement.classList.add('today');
      }

      dayElement.addEventListener('click', () => this.selectDate(day));
      daysContainer.appendChild(dayElement);
    }

    this.calendarContainer.appendChild(daysContainer);
  }

  changeMonth(offset, event) {
    event.stopPropagation();
    this.currentDate.setMonth(this.currentDate.getMonth() + offset);
    this.createCalendar();
  }

  selectDate(day) {
    this.selectedDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      day
    );
    this.date.innerHTML = this.selectedDate.toLocaleDateString('en-AU');
    this.calendarContainer.style.display = 'none';
    this.clearTimeSchedule();
    this.currentDate = this.selectedDate;
    this.render();
    this.loadDataFromLocalStorage();
  }

  openCalendar(e) {
    e.stopPropagation();
    const isDisplayed = this.calendarContainer.style.display === 'block';
    if (!isDisplayed) {
      this.currentDate = new Date();
      this.createCalendar();
    }
    this.calendarContainer.style.display = isDisplayed ? 'none' : 'block';
  }

  closeCalendar(e) {
    if (!this.calendarContainer.contains(e.target)) {
      this.calendarContainer.style.display = 'none';
    }
  }

  Settings() {
    this.settingsMenu = document.createElement('div');
    this.settingsMenu.className = 'settings-menu';
    this.settingsMenu.style.display = 'none';
    document.body.appendChild(this.settingsMenu);

    this.settingsBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      const isDisplayed = this.settingsMenu.style.display === 'block';
      this.settingsMenu.style.display = isDisplayed ? 'none' : 'block';
    });

    const clearAllOption = document.createElement('div');
    clearAllOption.textContent = 'Reset Schedule';
    clearAllOption.addEventListener('click', (e) => this.clearAllSchedule(e));
    this.settingsMenu.appendChild(clearAllOption);

    document.addEventListener('click', (event) => {
      if (!this.settingsBtn.contains(event.target)) {
        this.settingsMenu.style.display = 'none';
      }
    });
  }

  clearAllSchedule(e) {
    this.scheduleData = [];
    this.closeCalendar(e);
    this.currentDate = new Date();
    this.date.innerHTML = this.currentDate.toLocaleDateString('en-AU');
    this.clearTimeSchedule();
    this.render();
    localStorage.removeItem('schedule');
  }

  clearTimeSchedule() {
    while (this.scheduleList.firstChild) {
      this.scheduleList.removeChild(this.scheduleList.firstChild);
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('schedule', JSON.stringify(this.scheduleData));
  }

  loadDataFromLocalStorage() {
    const data = localStorage.getItem('schedule');
    if (data) {
      this.scheduleData = JSON.parse(data);
      for (const { id, value } of this.scheduleData) {
        const input = document.getElementById(id);
        if (input) {
          input.value = value;
        }
      }
    }
  }
}

const schedule = new Schedule();
export default schedule;
