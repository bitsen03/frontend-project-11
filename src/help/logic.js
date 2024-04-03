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
  


    // <?xml version="1.0" encoding="UTF-8"?><rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0"><channel><title><![CDATA[Lorem ipsum feed for an interval of 1 minutes with 10 item(s)]]></title><description><![CDATA[This is a constantly updating lorem ipsum feed]]></description><link>http://example.com/</link><generator>RSS for Node</generator><lastBuildDate>Wed, 03 Apr 2024 10:15:23 GMT</lastBuildDate><pubDate>Wed, 03 Apr 2024 10:15:00 GMT</pubDate><copyright><![CDATA[Michael Bertolacci, licensed under a Creative Commons Attribution 3.0 Unported License.]]></copyright><ttl>1</ttl><item><title><![CDATA[Lorem ipsum 2024-04-03T10:15:00Z]]></title><description><![CDATA[Laborum ipsum cupidatat qui velit occaecat incididunt.]]></description><link>http://example.com/test/1712139300</link><guid isPermaLink="true">http://example.com/test/1712139300</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Wed, 03 Apr 2024 10:15:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2024-04-03T10:14:00Z]]></title><description><![CDATA[Officia id laboris do ad eu anim aliquip.]]></description><link>http://example.com/test/1712139240</link><guid isPermaLink="true">http://example.com/test/1712139240</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Wed, 03 Apr 2024 10:14:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2024-04-03T10:13:00Z]]></title><description><![CDATA[Duis irure laborum Lorem elit nostrud esse minim.]]></description><link>http://example.com/test/1712139180</link><guid isPermaLink="true">http://example.com/test/1712139180</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Wed, 03 Apr 2024 10:13:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2024-04-03T10:12:00Z]]></title><description><![CDATA[Exercitation velit voluptate occaecat enim pariatur irure nostrud est proident magna consectetur Lorem.]]></description><link>http://example.com/test/1712139120</link><guid isPermaLink="true">http://example.com/test/1712139120</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Wed, 03 Apr 2024 10:12:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2024-04-03T10:11:00Z]]></title><description><![CDATA[Fugiat amet tempor ut nulla incididunt velit pariatur et ullamco.]]></description><link>http://example.com/test/1712139060</link><guid isPermaLink="true">http://example.com/test/1712139060</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Wed, 03 Apr 2024 10:11:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2024-04-03T10:10:00Z]]></title><description><![CDATA[Mollit velit aliquip id nulla minim tempor commodo Lorem proident nostrud qui ut culpa exercitation.]]></description><link>http://example.com/test/1712139000</link><guid isPermaLink="true">http://example.com/test/1712139000</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Wed, 03 Apr 2024 10:10:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2024-04-03T10:09:00Z]]></title><description><![CDATA[Proident aliqua est id exercitation sint amet.]]></description><link>http://example.com/test/1712138940</link><guid isPermaLink="true">http://example.com/test/1712138940</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Wed, 03 Apr 2024 10:09:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2024-04-03T10:08:00Z]]></title><description><![CDATA[Quis Lorem sunt dolor cupidatat voluptate pariatur esse veniam ipsum fugiat.]]></description><link>http://example.com/test/1712138880</link><guid isPermaLink="true">http://example.com/test/1712138880</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Wed, 03 Apr 2024 10:08:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2024-04-03T10:07:00Z]]></title><description><![CDATA[Ipsum pariatur eu cillum ipsum.]]></description><link>http://example.com/test/1712138820</link><guid isPermaLink="true">http://example.com/test/1712138820</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Wed, 03 Apr 2024 10:07:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2024-04-03T10:06:00Z]]></title><description><![CDATA[Et laboris pariatur pariatur dolor dolore velit ea magna elit incididunt est nostrud quis anim.]]></description><link>http://example.com/test/1712138760</link><guid isPermaLink="true">http://example.com/test/1712138760</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Wed, 03 Apr 2024 10:06:00 GMT</pubDate></item></channel></rss>