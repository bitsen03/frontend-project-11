import * as yup from 'yup';
import onChange from 'on-change';
import render from './render.js';
import validate from './validate.js'


const validationSchema = yup
  .string()
  .url('Введите правильный URL')
  .required('URL обязателен для заполнения');

const items =  {
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('.feedback'),
  example: document.querySelector('p > .mt-2 mb-0'),
  container: document.querySelector('qwe')
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

    fetch(`https://allorigins.hexlet.app/get?url=${('https://ru.hexlet.io/lessons.rss')}`)
    .then(response => {
      if (response.ok) return response.json()
      throw new Error('Network response was not ok.')
    })
    .then(data => console.log(data.contents));
  });
};
  