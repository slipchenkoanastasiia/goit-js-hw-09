import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from 'notiflix';

function addLeadingZero(value) {
  return value < 10 ? `0${value}` : value;
}

function calculateTimeDifference(targetDate) {
  const currentDate = new Date();
  const difference = targetDate - currentDate;
  if (difference < 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const oneSecond = 1000;
  const oneMinute = oneSecond * 60;
  const oneHour = oneMinute * 60;
  const oneDay = oneHour * 24;

  const days = Math.floor(difference / oneDay);
  const hours = Math.floor((difference % oneDay) / oneHour);
  const minutes = Math.floor((difference % oneHour) / oneMinute);
  const seconds = Math.floor((difference % oneMinute) / oneSecond);

  return { days, hours, minutes, seconds };
}

const datetimePicker = document.getElementById("datetime-picker");
const startButton = document.querySelector('[data-start]');
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');

let countdownInterval;

startButton.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate <= new Date()) {
      Notiflix.Notify.warning("Будь ласка оберіть майбутню дату");
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
};

flatpickr("#datetime-picker", options);

startButton.addEventListener('click', () => {
  const selectedDate = flatpickr.parseDate(datetimePicker.value, "Y-m-d H:i");
  startButton.disabled = true;

  countdownInterval = setInterval(updateCountdown, 1000, selectedDate);
  updateCountdown(selectedDate);
});

function updateCountdown(targetDate) {
  const timeDifference = calculateTimeDifference(targetDate);
  if (timeDifference.days === 0 && timeDifference.hours === 0 && timeDifference.minutes === 0 && timeDifference.seconds === 0) {
    clearInterval(countdownInterval);
  }

  daysValue.textContent = addLeadingZero(timeDifference.days);
  hoursValue.textContent = addLeadingZero(timeDifference.hours);
  minutesValue.textContent = addLeadingZero(timeDifference.minutes);
  secondsValue.textContent = addLeadingZero(timeDifference.seconds);
}