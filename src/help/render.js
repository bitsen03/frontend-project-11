import {resetStyle} from "./reset.js";
import i18n from 'i18next';
import text from '../text.js';

const i18nextInstance = i18n.createInstance();
  
await i18nextInstance.init({
  lng: 'ru', // Текущий язык
  debug: true,
  text,
});


const outPut = (items) => {
  const titles = items.post.titles;
  const links = items.post.links;
  const description = items.post.description
  items.container.innerHTML = '';

  const newUl = document.createElement('ul');
  newUl.classList.add("list-group", "border-0", "rounded-0");

  for (let i = 0; i < titles.length; i += 1) {
    const li = document.createElement('li');
    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-start", "border-0", "border-end-0");

    const a = document.createElement('a');
    a.textContent = titles[i];
    a.setAttribute('href', links[i]);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.classList.add("fw-bold");
    a.id = i;
  

    const button = document.createElement('button');
    button.id = i;
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const id = e.target.id;
      const newA = document.getElementById(id); 
      newA.classList.remove('fw-bold');
      newA.classList.add('fw-normal', 'link-secondary');
      items.post.useTitlesId.push(id);
    })
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.classList.add("btn", "btn-outline-primary", "btn-sm");
    button.textContent = 'Просмотр';

    const modalElement = document.querySelector('.modal-header');
    modalElement.textContent = titles[i];

    const modalButton = document.querySelector('.modal-footer > a');
    modalButton.setAttribute('href', links[i]);
  
    const modalDescription = document.querySelector('.modal-body');
    modalDescription.textContent = description[i]
    li.appendChild(a);
    li.appendChild(button);
    newUl.appendChild(li);
   
    if (items.post.useTitlesId.some((el) => +el === i)) {
      a.classList.remove("fw-bold")
      a.classList.add("fw-normal", "link-secondary")
    }   
   
  }

  items.container.appendChild(newUl);
};


export default async (state, items) => {
    const item = items.feedback;
    resetStyle(item);
      if (state.isValid === 'isValid') {   
        outPut(items)
        item.classList.add("text-success");
        items.input.classList.remove('is-invalid');
        items.input.value = '';
        items.input.focus();
      } else {
        item.classList.add("text-danger");
        items.input.classList.add('is-invalid');
      }
      item.textContent = `${i18nextInstance.t(text[state.isValid])}`
    };