import resetStyle from "./resetStyle.js";
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
const newUl = document.createElement('ul');
newUl.classList.add("ist-group", "border-0", "rounded-0")

for (let i = 0; i < titles.length; i += 1 ){
const li = document.createElement('li')
li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-start", "border-0", "border-end-0")
const a = document.createElement('a')
a.textContent = titles[i].innerHTML
a.setAttribute('href', links[i].innerHTML)
a.classList.add("fw-bold")
li.appendChild(a)

newUl.appendChild(li)
}

items.container.appendChild(newUl)


}

export default async (state, items) => {
  // outPut(items)
  console.log(items.post)
    const item = items.feedback;
    resetStyle(item);
      if (state.isValid === 'isValid') {
        item.classList.add("text-success");
        items.input.classList.remove('is-invalid')
        items.input.value = '';
        items.input.focus()
      } else {
    
        item.classList.add("text-danger");
        items.input.classList.add('is-invalid')
      }
      item.textContent = `${i18nextInstance.t(text[state.isValid])}`
    };