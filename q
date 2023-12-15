import * as yup from 'yup';
import onChange from 'on-change';
import render from './render.js';
import validate from './validate.js';
import { badConection } from './view.js';
import { reset } from './reset.js';

const validationSchema = yup
  .string()
  .url('Введите правильный URL')
  .required('URL обязателен для заполнения');

const items = {
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('.feedback'),
  example: document.querySelector('p > .mt-2 mb-0'),
  container: document.querySelector('.container-xxl'),
  post: {
    links: [],
    titles: [],
    urls: [],
  },
};

const checkSame = (arr, checkValue) => {
  return arr.every((el) => el !== checkValue);
};

const addPost = ([titles, links]) => {
  for (const title of titles) {
    if (!items.post.titles.includes(title.textContent)) {
      items.post.titles.push(title.textContent);
    }
  }
  for (const link of links) {
    if (!items.post.links.includes(link.textContent)) {
      items.post.links.push(link.textContent);
    }
  }
};

const submitEvent = async (watchedState) => {
  try {
    reset(items, watchedState);
    const url = items.input.value;

    if (!items.post.urls.includes(url)) {
      items.post.urls.push(url);
    }

    await validate(url, watchedState, validationSchema);

    const response = await fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`);
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const data = await response.json();

    if (data.contents === '') {
      badConection(watchedState);
      return;
    }
    if (watchedState.isValid === 'isValid') {
      const parserData = await parser(data);
      addPost(parserData);
    }

    watchedState.someFlag = true;
  } catch (error) {
    console.error('Error:', error);
    watchedState.someFlag = true;
  }
};

const checkUpdateRss = async (state, items) => {
  try {
    const url = 'https://allorigins.hexlet.app/get?url=' + encodeURIComponent('https://example.com/rss-feed'); // Замените URL на свой
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const data = await response.json();
    const arrPost = await parser(data);

    // Проверка наличия новых заголовков или ссылок
    const hasNewTitles = arrPost[0].length > 0 && !items.post.titles.includes(arrPost[0][0].textContent);
    const hasNewLinks = arrPost[1].length > 0 && !items.post.links.includes(arrPost[1][0].textContent);

    if (hasNewTitles || hasNewLinks) {
      addPost(arrPost);
      render(state, items); // Обновляем интерфейс
    }
  } catch (error) {
    console.error('Error:', error);
  }

  setTimeout(checkUpdateRss, 5000);
};

const parser = async (data) => {
  const xmlText = data.contents;
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

  const titles = xmlDoc.getElementsByTagName('title');
  const links = xmlDoc.getElementsByTagName('link');

  return [titles, links];
};

export default async () => {
  const state = {
    isValid: null,
    feed: new Set(),
    someFlag: false,
  };

  const watchedState = onChange(state, () => {
    if (watchedState.someFlag) {
      render(watchedState, items);
    }
  });

  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitEvent(watchedState);
  });

  checkUpdateRss(state, items);
};
