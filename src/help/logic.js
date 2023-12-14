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
        urls: [],
      }
    }
 

    const addPost = ([titles, links]) =>{
      for (const title of titles) {
        if (!items.post.titles.includes(title)) {
          items.post.titles.push(title);
        }
     }
     for (const link of links) {
      if (!items.post.links.includes(link)) {
        items.post.links.push(link);
      }
    }
    }

    const submitEveant = async (e, watchedState) => {
      try {
        if (e) {
          e.preventDefault();
        }
    
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
    
        const parserData = await parser(data);
        addPost(parserData);
        watchedState.someFlag = true;
      } catch (error) {
        console.error('Error:', error);
        watchedState.someFlag = true;
      }
    };
    

  const checkUpdateRss = async (urls, watchedState) => {
    console.log('хотябы запускаеться')
    urls.forEach(async url => {
      await fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
    .then(response => {
      if (!response.ok) {  
        throw new Error('Network response was not ok.');
      }
      return response.json(); // Получаем JSON
    }).then(data => {
      parser(data)
      .then(arrPost => {
        if (arrPost[0].length !== items.post.titles.length){
          console.log('все плохо')
        } else {
          console.log('все норм')
        }
      })
    })
    });
    
    setTimeout(() => checkUpdateRss(urls), 5000)
  }
    const parser = async (data) => {
      const xmlText = data.contents;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
   
      const titles = xmlDoc.getElementsByTagName('title');
      const links = xmlDoc.getElementsByTagName('link');

     return [titles, links]
    }
    
    
    export default async () => {
    
      const state = {
        isValid: null,
        feed: new Set(),
        someFlag: null,
      };
      
      const watchedState = onChange(state, () => {
        if (watchedState.someFlag) {
          render(watchedState, items);
        }
      });
      
      const form = document.querySelector('form');
    
   
      form.addEventListener('submit', (e) => submitEveant(e, watchedState));
      checkUpdateRss(items.post.urls, watchedState)
    };
  
  