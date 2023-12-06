import { isValid, unValid, haveThisUrl } from './view.js';

export default async (dataToValidate, watchedState, validationSchema) => {
    try {
      if (watchedState.feed.has(dataToValidate)) {
        haveThisUrl(watchedState);
        return; 
      }
      const validData = await validationSchema.validate(dataToValidate); // eslint-disable-line
      watchedState.feed.add(dataToValidate);
      isValid(watchedState);
    } catch (validationErrors) {
      unValid(watchedState);
    }
  };