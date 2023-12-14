const unValid = (watchedState) => {
    if (watchedState){
      watchedState.isValid = 'unValid';}
  };
  const isValid = (watchedState) => {
    if (watchedState){
          watchedState.isValid = 'isValid';
    }

  };
  const haveThisUrl = (watchedState) => {
    if (watchedState){
watchedState.isValid = 'haveThisUrl';
    }
    
  }
const badConection = (watchedState) => {
  if (watchedState){
watchedState.isValid = 'badConection'
  }
  
}
  export {unValid, isValid, haveThisUrl, badConection}