import resetStyle from "./resetStyle.js";
import i18n from 'i18next';
import text from '../text.js';

const i18nextInstance = i18n.createInstance();
  
await i18nextInstance.init({
  lng: 'ru', // Текущий язык
  debug: true,
  text,
});

export default (state, items) => {
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