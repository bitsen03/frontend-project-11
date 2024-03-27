import { isValid, unValid, haveThisUrl } from './view.js';

export default async (dataToValidate, watchedState, validationSchema) => {
    try {
      if (watchedState.feed.has(dataToValidate)) {
        haveThisUrl(watchedState);
        return; 
      }
      await validationSchema.validate(dataToValidate);    
      watchedState.feed.add(dataToValidate);
      isValid(watchedState);
    } catch (validationErrors) {
      unValid(watchedState);
    }
  };