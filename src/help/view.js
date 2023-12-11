const unValid = (watchedState) => {
    watchedState.isValid = 'unValid';
  };
  const isValid = (watchedState) => {
    watchedState.isValid = 'isValid';
  };
  const haveThisUrl = (watchedState) => {
    watchedState.isValid = 'haveThisUrl';
  }
const badConection = (watchedState) => {
  watchedState.isValid = 'badConection'
}
  export {unValid, isValid, haveThisUrl, badConection}