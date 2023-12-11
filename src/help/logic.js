

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
      container: document.querySelector('.container-xxl'),
      post: {
        links: [],
        titles: [],
      }
    }
      
    const parser = (data) => {
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
     console.log(items.post)
    }
    
    
    export default async () => {
    
      const state = {
        isValid: null,
        feed: new Set(),
      };
      
      const watchedState = onChange(state, () => {
        // if (watchedState.someFlag) {
          render(watchedState, items);
        // }
      });
      
      const form = document.querySelector('form');
    
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url =  items.input.value;
    
        await validate(url, watchedState, validationSchema);
        
        fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent('https://ru.hexlet.io/lessons.rss')}`)
        .then((el) => console.log(el))
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok.');
            }
            console.log(response)
            return response.json(); // Получаем JSON
          })
          .then(data => {
            console.log(data)
            parser(data);
            // Устанавливаем флаг, чтобы сигнализировать об окончании парсинга
            watchedState.someFlag = true;
          })
          .catch(error => {
            console.error('Error:', error);
            // В случае ошибки тоже устанавливаем флаг, чтобы избежать блокировки
            watchedState.someFlag = true;
          });
      });
    
      
    };
      