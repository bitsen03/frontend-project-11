import i18n from 'i18next';
import { resetStyle } from './reset.js';
import text from '../text.js';

const i18nextInstance = i18n.createInstance();

await i18nextInstance.init({
  lng: 'ru', // Текущий язык
  debug: true,
  text,
});

const changeModaltitle = (i, titles, description) => {
  const modalElement = document.querySelector('.modal-title');
  modalElement.textContent = titles[i];
  const modalDescription = document.querySelector('.modal-body');
  modalDescription.textContent = description[i];
};

const feeds = (mainTitle, mainDescription) => {
  const divCard = document.createElement('div');
  divCard.classList.add('card-body');

  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = 'Фиды';

  divCard.appendChild(h2);
  const newUl = document.createElement('ul');
  newUl.classList.add('list-group', 'border-0', 'rounded-0');
  mainTitle.forEach((title, indx) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = title;
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = mainDescription[indx];
    li.appendChild(h3);
    li.appendChild(p);
    newUl.appendChild(li);
  });

  const card = document.createElement('div');
  card.classList.add('card', 'borser-0');

  card.appendChild(divCard);
  card.appendChild(newUl);
  return card;
};

const outPut = (items) => {
  const { titles, links, description, mainTitle, mainDescription } = items.post;

  items.container.innerHTML = '';
  items.feeds.innerHTML = '';
  const newUl = document.createElement('ul');
  newUl.classList.add('list-group', 'border-0', 'rounded-0');
  const post = document.createElement('div');
  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  post.classList.add('card-body');
  cardTitle.textContent = 'Посты';

  post.appendChild(cardTitle);

  for (let i = 0; i < titles.length; i += 1) {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const a = document.createElement('a');
    a.textContent = titles[i];
    a.setAttribute('href', links[i]);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.setAttribute('data-id', i);
    a.classList.add('fw-bold');
    const button = document.createElement('button');
    button.setAttribute('data-id', i);
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const id = e.target.getAttribute('data-id');
      const newA = document.querySelector(`[data-id="${id}"]`); 
      newA.classList.remove('fw-bold');
      newA.classList.add('fw-normal', 'link-secondary');
      items.post.useTitlesId.push(id);
      changeModaltitle(i, titles, description);
      })
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.textContent = 'Просмотр';

    const modalButton = document.querySelector('.modal-footer > a');
    modalButton.setAttribute('href', links[i]);
  
    li.appendChild(a);
    li.appendChild(button);
    newUl.appendChild(li);
   
    if (items.post.useTitlesId.some((el) => +el === i)) {
      a.classList.remove('fw-bold');
      a.classList.add('fw-normal', 'link-secondary');
    }   
  }
  const card = document.createElement('div');
  card.classList.add('card', 'borser-0');
  card.appendChild(post);
  card.appendChild(newUl);
  const feedsBlock = feeds(mainTitle, mainDescription);
  items.feeds.appendChild(feedsBlock); 
  items.container.appendChild(card);
};

export default async (state, items) => {
    const item = items.feedback;
    resetStyle(item);
      if (state.isValid === 'isValid') {   
        outPut(items);
        item.classList.add('text-success');
        items.input.classList.remove('is-invalid');
        items.input.value = '';
        items.input.focus();
      } else {
        item.classList.add('text-danger');
        items.input.classList.add('is-invalid');
      }
      item.textContent = `${i18nextInstance.t(text[state.isValid])}`;
    };
