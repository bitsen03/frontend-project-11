import * as yup from 'yup';
import onChange from 'on-change';
import render from './render.js';
import validate from './validate.js'
import axios from 'axios'


const validationSchema = yup
  .string()
  .url('Введите правильный URL')
  .required('URL обязателен для заполнения');

const items =  {
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('.feedback'),
  example: document.querySelector('p > .mt-2 mb-0'),
}

export default async () => {

  const state = {
    isValid: null,
    feed: new Set(),
  };
  
  const watchedState = onChange(state, () => render(watchedState, items));
  
  const form = document.querySelector('form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url =  items.input.value;
    await validate(url, watchedState, validationSchema);
    axios.get('https://ru.hexlet.io/lessons.rss')
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      if (error.response) {
        // Запрос выполнен, сервер ответил статус-кодом
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // Запрос сделан, но ответ не получен
        console.log(error.request);
      } else {
        // Что-то пошло не так при настройке запроса
        console.log('Ошибка', error.message);
      }
      console.log(error.config);
    });
  });
};
  