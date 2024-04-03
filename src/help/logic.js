import * as yup from 'yup';
import onChange from 'on-change';
import render from './render.js';
import validate from './validate.js'
import { badConection, networkError } from './view.js';
import {reset} from './reset.js';


const validationSchema = yup
  .string()
  .url('Введите правильный URL')
  .required('URL обязателен для заполнения');
    
    const items =  {
      input: document.querySelector('#url-input'),
      feedback: document.querySelector('.feedback'),
      example: document.querySelector('p > .mt-2 mb-0'),
      container: document.querySelector('.posts'),
      feeds: document.querySelector('.feeds'),

      post: {
        links: [],
        titles: [],
        description: [],
        mainTitle: [],
        urls: [],
        useTitlesId: [],
        mainDescription: [],
      }
    }
 
const addPost = ([titles, links, description, mainTitle, mainDescription]) => {
  const newTitles = Array.from(titles).map(title => title.textContent);
  const newLinks = Array.from(links).map(link => link.textContent);
  const newDescription = Array.from(description).map(des => des.textContent);
  const newMainTitles = Array.from([mainTitle]).map(mainT => mainT.textContent);
  const newMainDescription = Array.from([mainDescription]).map(mainD => mainD.textContent);

  newTitles.forEach(newTitle => {
    if (!items.post.titles.includes(newTitle)) {
      items.post.titles.push(newTitle);
    }
  });

  newMainTitles.forEach(newMainTitle => {
    if (!items.post.mainTitle.includes(newMainTitle)) {
      items.post.mainTitle.push(newMainTitle);
    }
  })
  newMainDescription.forEach(el => {
    if (!items.post.mainDescription.includes(el)) {
      items.post.mainDescription.push(el);
    }
  })

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


const queryString = `disableCache=${'true'}`;
//
    const submitEveant = async (watchedState) => {
      try {
        reset(items, watchedState);
        const url = items.input.value;

        await validate(url, watchedState, validationSchema);

        const response = await fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&${queryString}`, { timeout: 5000 })
        
        const data = await response.json();
        const parserData = await parser(data);
        if (watchedState.isValid === "isValid"){
          if (parserData.some((el) => el.length === 0)) {
            badConection(watchedState)
          watchedState.someFlag = true;
          return;
        }
          if (!items.post.urls.includes(url)) {
            items.post.urls.push(url);
          }
          addPost(parserData);
        }
        watchedState.someFlag = true;
      } catch (error) {
        networkError(watchedState);
        watchedState.someFlag = true;
        console.error('Error:', error);
      }
    };
    
  const checkUpdateRss = async (items, watchedState) => {
  for (const url of items.post.urls) {
    try {
      const response = await fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&${queryString}`);

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
      console.log(xmlText)
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
      const mainTitle = xmlDoc.querySelector('title');
      const titles = xmlDoc.querySelectorAll('item>title');
      const links = xmlDoc.querySelectorAll('item>link');
      const description = xmlDoc.querySelectorAll('item>description');
      const mainDescription = xmlDoc.querySelector('description');
     return [titles, links, description, mainTitle, mainDescription];
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
        e.preventDefault();
        submitEveant(watchedState);
      });
      checkUpdateRss(items, watchedState);
    };
  