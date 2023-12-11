const resetStyle = (item) => {
    item.classList.remove("text-success");
    item.classList.remove("text-danger");
  }
  const reset = (items, watchedState) => {
    watchedState.someFlag = false;

    items.post = {
      links: [],
      titles: [],
    };

  } 
  export  { resetStyle, reset}