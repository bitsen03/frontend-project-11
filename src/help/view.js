const unValid = (watchedState) => {
  if (watchedState) {
    watchedState.isValid = 'unValid';
  }
};

const isValid = (watchedState) => {
  if (watchedState) {
    watchedState.isValid = 'isValid';
  }
};

const haveThisUrl = (watchedState) => {
  if (watchedState) {
    watchedState.isValid = 'haveThisUrl';
  }
};

const badConection = (watchedState) => {
  watchedState.isValid = 'badConection';
};

const networkError = (watchedState) => {
  watchedState.isValid = 'networkError';
};

export {
   unValid, isValid, haveThisUrl, badConection, networkError 
  };
