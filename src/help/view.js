const unValid = (watchedState) => {
    watchedState.isValid = 'unValid';
  };
  const isValid = (watchedState) => {
    watchedState.isValid = 'isValid';
  };
  const haveThisUrl = (watchedState) => {
    watchedState.isValid = 'haveThisUrl';
  }
  
  export {unValid, isValid, haveThisUrl}