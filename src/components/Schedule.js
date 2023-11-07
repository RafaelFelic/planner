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

    this.Settings();
    this.loadDataFromLocalStorage();

    this.calendar.addEventListener('click', (e) => this.openCalendar(e));

    const scheduleComponent = document.querySelector('.schedule');

    let isInSchedule = false;

    this.container.addEventListener(
      'scroll',
      (e) => {
        let currentScrollLeft = this.container.scrollLeft;

        const componentWidth = scheduleComponent.offsetWidth;
        const scheduleStart = componentWidth;
        const scheduleEnd =
          scheduleStart + componentWidth - componentWidth * 0.7;

        // Verifica se o scroll atual está dentro dos limites do Schedule
        const isCurrentlyInSchedule =
          currentScrollLeft >= scheduleStart &&
          currentScrollLeft <= scheduleEnd;

        // Se acabou de entrar no Schedule, atualiza a flag para verdadeiro
        if (isCurrentlyInSchedule && !isInSchedule) {
          isInSchedule = true;
        }

        // Se acabou de sair do Schedule, chama init e atualiza a flag para falso
        if (!isCurrentlyInSchedule && isInSchedule) {
          console.log('init');
          this.init(e); // Chame a função init
          isInSchedule = false; // Atualiza a flag
        }
      },
      false
    );

    document.addEventListener('click', (e) => this.closeCalendar(e));
  }

  init(e) {
    this.closeCalendar(e);
    this.currentDate = new Date();
    this.date.innerHTML = this.currentDate.toLocaleDateString('en-AU');
    this.clearTimeSchedule();
    this.render();
    this.loadDataFromLocalStorage();
  }

  render() {
    for (let hour = 5; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`;
        const listItem = document.createElement('li');
        const input = document.createElement('input');
        input.type = 'text';

        const id = `${hour.toString().padStart(2, '0')}${minute
          .toString()
          .padStart(2, '0')}${this.currentDate
          .getDate()
          .toString()
          .padStart(2, '0')}${(this.currentDate.getMonth() + 1)
          .toString()
          .padStart(2, '0')}${this.currentDate.getFullYear()}`;
        input.id = id;

        input.addEventListener('change', () => {
          this.updateScheduleData.call(this, input.value, id);
        });

        input.addEventListener('blur', () => {
          this.updateScheduleData.call(this, input.value, id);
        });

        // Verifica se existe um valor salvo para o ID e define o valor do campo
        const existingEntry = this.scheduleData.find(
          (entry) => entry.id === id
        );
        if (existingEntry) {
          input.value = existingEntry.value;
        }

        // Verifica se existe um valor salvo para o ID e define o valor do campo
        // if (this.scheduleData && this.scheduleData[id]) {
        //   input.value = this.scheduleData[id];
        // }

        listItem.appendChild(document.createTextNode(time + ' - '));
        listItem.appendChild(input);
        this.scheduleList.appendChild(listItem);
      }
    }

    this.date.innerHTML = this.currentDate.toLocaleDateString('en-AU');
  }

  updateScheduleData(value, id) {
    const trimmedValue = value.trim();
    const existingEntryIndex = this.scheduleData.findIndex(
      (entry) => entry.id === id
    );

    if (trimmedValue !== '') {
      // Atualiza ou adiciona uma nova entrada
      if (existingEntryIndex !== -1) {
        this.scheduleData[existingEntryIndex].value = trimmedValue;
      } else {
        this.scheduleData.push({ id, value: trimmedValue });
      }
    } else if (existingEntryIndex !== -1) {
      // Remove a entrada existente se o valor for uma string vazia
      this.scheduleData.splice(existingEntryIndex, 1);
    }

    this.saveToLocalStorage();
  }

  createCalendar() {
    this.calendarContainer.innerHTML = '';

    // Cabeçalho do calendário
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

    // Dias da semana
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

    // Calcula qual dia da semana o primeiro dia do mês cai
    const firstDayOfMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1
    ).getDay();

    // Espaços em branco para os dias antes do primeiro do mês
    for (let i = 0; i < firstDayOfMonth; i++) {
      const spacer = document.createElement('div');
      spacer.className = 'calendar-day empty';
      daysContainer.appendChild(spacer);
    }

    // Dias do mês
    const daysInMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      0
    ).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-day';
      dayElement.textContent = day;
      dayElement.addEventListener('click', () => this.selectDate(day));
      daysContainer.appendChild(dayElement);
    }

    this.calendarContainer.appendChild(daysContainer);
  }

  changeMonth(offset, event) {
    event.stopPropagation(); // Impede a propagação do evento
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

    // Limpa os agendamentos atuais e carrega os dados para a nova data.
    this.clearTimeSchedule();
    this.currentDate = this.selectedDate;
    this.render();
    this.loadDataFromLocalStorage();
  }

  openCalendar(e) {
    e.stopPropagation();
    const isDisplayed = this.calendarContainer.style.display === 'block';

    if (!isDisplayed) {
      // Define currentDate para a data atual apenas se o calendário estiver sendo aberto
      this.currentDate = new Date();
      this.createCalendar(); // Isso irá criar o calendário para a data atual
    }

    // Alterna a exibição do calendário
    this.calendarContainer.style.display = isDisplayed ? 'none' : 'block';
  }

  closeCalendar(e) {
    const isClickInsideCalendar = this.calendarContainer.contains(e.target);

    if (!isClickInsideCalendar) {
      this.calendarContainer.style.display = 'none';
    }
  }

  Settings() {
    this.settingsMenu = document.createElement('div');
    this.settingsMenu.className = 'settings-menu';
    this.settingsMenu.style.display = 'none';
    document.body.appendChild(this.settingsMenu);

    // Adiciona evento de clique para mostrar o menu de configurações
    this.settingsBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      const isDisplayed = this.settingsMenu.style.display === 'block';
      this.settingsMenu.style.display = isDisplayed ? 'none' : 'block';
    });

    // Adiciona opção de apagar todo o agendamento no menu de configurações
    const clearAllOption = document.createElement('div');
    clearAllOption.textContent = 'Reset Schedule';
    clearAllOption.addEventListener('click', (e) => this.clearAllSchedule(e));
    this.settingsMenu.appendChild(clearAllOption);

    // Fecha o menu de configurações ao clicar fora
    document.addEventListener('click', (event) => {
      if (!this.settingsBtn.contains(event.target)) {
        this.settingsMenu.style.display = 'none';
      }
    });
  }

  clearAllSchedule(e) {
    this.scheduleData = []; // Corrigido para um array vazio
    this.closeCalendar(e);
    this.currentDate = new Date();
    this.date.innerHTML = this.currentDate.toLocaleDateString('en-AU');
    this.clearTimeSchedule();
    this.render();
    localStorage.removeItem('schedule');
  }

  clearTimeSchedule() {
    // Remove todos os elementos filhos da lista de agendamentos.
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
