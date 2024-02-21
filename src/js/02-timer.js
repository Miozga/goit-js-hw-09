import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const datetimePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('button[data-start]');
startButton.disabled = true;

let selectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const currentDate = new Date();
    if (selectedDates[0] <= currentDate) {
      Notiflix.Notify.failure('Please choose a date in the future');
    } else {
      selectedDate = selectedDates[0];
      startButton.disabled = false;
    }
  },
};

flatpickr(datetimePicker, options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimerInterface(time) {
  document.querySelector('.value[data-days]').textContent = addLeadingZero(
    time.days
  );
  document.querySelector('.value[data-hours]').textContent = addLeadingZero(
    time.hours
  );
  document.querySelector('.value[data-minutes]').textContent = addLeadingZero(
    time.minutes
  );
  document.querySelector('.value[data-seconds]').textContent = addLeadingZero(
    time.seconds
  );
}

startButton.addEventListener('click', () => {
  startButton.disabled = true;

  const intervalId = setInterval(() => {
    const currentTime = new Date();
    const deltaTime = selectedDate - currentTime;
    const time = convertMs(deltaTime);

    updateTimerInterface(time);

    if (deltaTime <= 0) {
      clearInterval(intervalId);
      updateTimerInterface(convertMs(0));
      Notiflix.Notify.success('The countdown has finished!');
    }
  }, 1000);
});
