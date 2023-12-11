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
      }
    }
      
    const parser = async (data) => {
      const xmlText = data.contents;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
   
      const titles = xmlDoc.getElementsByTagName('title');
      const links = xmlDoc.getElementsByTagName('link');

      for (const title of titles) {
        items.post.titles.push(title);
     }
     
     for (const link of links) {
        items.post.links.push(link);
     }
    }
    
    
    export default async () => {
    
      const state = {
        isValid: null,
        feed: new Set(),
      };
      
      const watchedState = onChange(state, () => {
        if (watchedState.someFlag) {
          render(watchedState, items);
        }
      });
      
      const form = document.querySelector('form');
    
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        reset(items,watchedState)
        const url =  items.input.value;    
        await validate(url, watchedState, validationSchema);

        await fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
          .then(response => {
            if (!response.ok) {  
              throw new Error('Network response was not ok.');
            }
            return response.json(); // Получаем JSON
          })
          .then(async data => {
            if (data.contents === ''){
              badConection(watchedState)
              return
            }
            parser(data);
            watchedState.someFlag = true;
          })
          .catch(error => {
            console.error('Error:', error);
            watchedState.someFlag = true;
          });
      });
    
    };
      