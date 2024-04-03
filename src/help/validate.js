import { isValid, unValid, haveThisUrl } from './view.js';

export default async (urlToValidate, watchedState, validationSchema) => {// eslint-disable-line
  try {
    if (watchedState.feed.has(urlToValidate)) {
      haveThisUrl(watchedState);
      return;
    }
    const validData = await validationSchema.validate(urlToValidate); // eslint-disable-line
    watchedState.feed.add(urlToValidate);
    isValid(watchedState);
  } catch (validationErrors) {
    unValid(watchedState);
  }
};
