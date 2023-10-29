class ScheduleComponent {
  constructor(scheduleListId) {
    this.scheduleListId = scheduleListId;
  }

  createTimeSchedule() {
    const scheduleList = document.getElementById(this.scheduleListId);

    if (!scheduleList) {
      console.error(`Elemento #${this.scheduleListId} não encontrado!`);
      return;
    }

    // Começa às 5:00 e vai até 23:30 (ajuste conforme necessário)
    for (let hour = 5; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`;
        const listItem = document.createElement('li');
        const input = document.createElement('input');
        input.type = 'text';

        listItem.appendChild(document.createTextNode(time + ' - '));
        listItem.appendChild(input);
        scheduleList.appendChild(listItem);
      }
    }
  }
}

// Uso da classe
const scheduleComponent = new ScheduleComponent('schedule-list');

export default scheduleComponent;
