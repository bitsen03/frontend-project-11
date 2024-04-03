const resetStyle = (item) => {
  item.classList.remove('text-success');
  item.classList.remove('text-danger');
};
const reset = (items, watchedState) => {
  if (watchedState) {
    watchedState.someFlag = false;
  }
};
export  { resetStyle, reset };