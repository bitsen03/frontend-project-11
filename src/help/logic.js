import * as yup from 'yup';
import onChange from 'on-change';
import render from './render.js';
import validate from './validate.js'
import { badConection } from './view.js';
import {reset} from './reset.js';

const validationSchema = yup
  .string()
  .url('Введите правильный URL')
  .required('URL обязателен для заполнения');
    
    const items =  {
      input: document.querySelector('#url-input'),
      feedback: document.querySelector('.feedback'),
      example: document.querySelector('p > .mt-2 mb-0'),
      container: document.querySelector('.container-xxl'),
      post: {
        links: [],
        titles: [],
        description: [],
        urls: [],
        useTitlesId: [],
      }
    }
 
const addPost = ([titles, links, description]) => {
  const newTitles = Array.from(titles).map(title => title.textContent);
  const newLinks = Array.from(links).map(link => link.textContent);
  const newDescription = Array.from(description).map(des => des.textContent);

  newTitles.forEach(newTitle => {
    if (!items.post.titles.includes(newTitle)) {
      items.post.titles.push(newTitle);
    }
  });

  newLinks.forEach(newLink => {
    if (!items.post.links.includes(newLink)) {
      items.post.links.push(newLink);
    }
  });

  newDescription.forEach(newDes => {
    if (!items.post.description.includes(newDes)) {
      items.post.description.push(newDes);
    }
  });
};

//
    const submitEveant = async (watchedState) => {
      try {
        reset(items, watchedState);
        const url = items.input.value;
        if (url.includes('disableCache')) {
          console.log('URL содержит параметр "disableCache"');
      } else {
          console.log('URL не содержит параметр "disableCache"');
      }
      
        if (!items.post.urls.includes(url)) {
          items.post.urls.push(url);
        }
    
        await validate(url, watchedState, validationSchema);
    
        const response = await fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`);
        console.log(response)
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        console.log(data)
        if (data.status.http_code === 404 || data.contents === null) {
          badConection(watchedState); 
          render(watchedState, items)
          return;
        }
        if (watchedState.isValid === "isValid"){
          const parserData = await parser(data);
          addPost(parserData);
        }
      

        watchedState.someFlag = true;
      } catch (error) {
        console.error('Error:', error);
        watchedState.someFlag = true;
      }
    };
    
  const checkUpdateRss = async (items, watchedState) => {
  for (const url of items.post.urls) {
    try {
      const response = await fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const data = await response.json();
      const arrPost = await parser(data);

      if (arrPost[0].length !== items.post.titles.length) {
        addPost(arrPost);
        render(watchedState, items);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  setTimeout(() => checkUpdateRss(items, watchedState), 5000);
};

    const parser = async (data) => {
      const xmlText = data.contents;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
   
      const titles = xmlDoc.getElementsByTagName('title');
      const links = xmlDoc.getElementsByTagName('link');
      const description = xmlDoc.getElementsByTagName('description');

     return [titles, links, description]
    }
    
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
        e.preventDefault()
        submitEveant(watchedState)
      });
      checkUpdateRss(items, watchedState)
    };
  