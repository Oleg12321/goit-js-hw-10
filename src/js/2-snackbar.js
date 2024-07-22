import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('form');
let promiseQueue = Promise.resolve();

form.addEventListener('submit', e => {
  e.preventDefault();

  let timeData = e.target.elements.delay.value;
  let fulfilled = e.target.querySelector('input[name="state"]:checked');
  const state = fulfilled.value;

  const newPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(`✅ Fulfilled promise in ${timeData}ms`);
      } else {
        reject(`❌ Rejected promise in ${timeData}ms`);
      }
    }, timeData);
  });

  promiseQueue = promiseQueue
    .then(() => newPromise)
    .then(resolve => {
      iziToast.success({
        title: 'Success',
        message: resolve,
      });
      console.log(resolve);
    })
    .catch(reject => {
      iziToast.error({
        title: 'Error',
        message: reject,
      });
      console.log(reject);
    });

  e.target.elements.delay.value = '';
  fulfilled.checked = false;
});
