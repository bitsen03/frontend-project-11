import * as yup from 'yup';
import onChange from 'on-change';
// import { isValid, unValid } from './view.js';
// import { render } from 'sass';

const validationSchema = yup
  .string()
  .url('Введите правильный URL')
  .required('URL обязателен для заполнения');

  const resetStyle = (item) => {
    item.classList.remove("text-success")
    item.classList.remove("text-danger")
  }


const render = (state, items) => {
const item = items.feedback;
  if (state.isValid === 1) {
    resetStyle(item);
    item.classList.add("text-success");
    item.textContent = "RSS успешно загружен"; 
    items.input.classList.remove('is-invalid')
    items.input.value = '';
    items.input.focus()
  } else {
    if (state.isValid === 2){
      items.feedback.textContent = "RSS уже существует";
    } else {
      items.feedback.textContent = "Ссылка должна быть валидным URL";
    }
    resetStyle(item);
    item.classList.add("text-danger");
    items.input.classList.add('is-invalid')
  }
};

const items =  {
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('.feedback'),
  example: document.querySelector('p > .mt-2 mb-0'),
}



export default () => {


  const state = {
    isValid: null,
    url: new Set(),
  };
  

  const watchedState = onChange(state, () => render(watchedState, items));
  
  const unValid = () => {
    watchedState.isValid = 0;
  };
  const isValid = () => {
    watchedState.isValid = 1;
  };
  const haveThisUrl = () => {
    watchedState.isValid = 2;
  }


  const validate = async (dataToValidate) => {
    try {
      if (state.url.has(dataToValidate)) {
        haveThisUrl();
        return; // Добавлено: завершаем функцию, если URL уже существует
      }
      const validData = await validationSchema.validate(dataToValidate);
      state.url.add(dataToValidate);
      console.log('Данные валидны:', validData);
      isValid();
    } catch (validationErrors) {
      console.error('Ошибки валидации:', validationErrors.errors);
      unValid();
    }
  };
  
  const form = document.querySelector('form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url =  items.input.value;
    await validate(url);
    console.log(state)
  });
};
  