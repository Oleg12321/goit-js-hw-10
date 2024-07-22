import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

const inputData = document.querySelector('input#datetime-picker');
const btnStart = document.querySelector('button[data-start]');
const dataDays = document.querySelector('span[data-days]');
const dataHours = document.querySelector('span[data-hours]');
const dataMinutes = document.querySelector('span[data-minutes]');
const dataSeconds = document.querySelector('span[data-seconds]');

let userSelectedDate;
let countdownInterval;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    console.log(userSelectedDate.getTime());
    if (userSelectedDate.getTime() < options.defaultDate.getTime()) {
      btnStart.disabled = true;
      iziToast.error({
        message: 'Please choose a date in the future',
      });
    } else {
      btnStart.disabled = false;
    }
  },
};

btnStart.addEventListener('click', () => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  const countdownDate = new Date(userSelectedDate);
  updateTimer(countdownDate);
  countdownInterval = setInterval(() => {
    updateTimer(countdownDate);
  }, 1000);
  inputData.disabled = true;
  btnStart.disabled = true;
});

function updateTimer(countdownDate) {
  const now = new Date();
  const distance = countdownDate.getTime() - now.getTime();

  if (distance < 0) {
    clearInterval(countdownInterval);
    dataDays.textContent = '00';
    dataHours.textContent = '00';
    dataMinutes.textContent = '00';
    dataSeconds.textContent = '00';
    iziToast.success({
      message: 'Time is up!',
    });
    inputData.disabled = false;
    btnStart.disabled = true;
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(distance);
  dataDays.textContent = String(days).padStart(2, '0');
  dataHours.textContent = String(hours).padStart(2, '0');
  dataMinutes.textContent = String(minutes).padStart(2, '0');
  dataSeconds.textContent = String(seconds).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % hour) / minute);
  const seconds = Math.floor((ms % minute) / second);

  return { days, hours, minutes, seconds };
}

flatpickr('input#datetime-picker', options);
