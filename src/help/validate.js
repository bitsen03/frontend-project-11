import { isValid, unValid, haveThisUrl } from './view.js';

export default async (urlToValidate, watchedState, validationSchema) => {
    try {
      if (watchedState.feed.has(urlToValidate)) {
        haveThisUrl(watchedState);
        return; 
      } 
      const validData = await validationSchema.validate(urlToValidate);    
      watchedState.feed.add(urlToValidate);
      isValid(watchedState);
    } catch (validationErrors) {
      unValid(watchedState);
    }
  };