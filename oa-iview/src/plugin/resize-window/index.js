export default {
  install(Vue, option) {
    Vue.prototype.resizeArray = new Array();
    let resizeIndex = 0;
    window.onresize = () => {
      clearTimeout(resizeIndex);
      resizeIndex = setTimeout(() => {
        Vue.prototype.resizeArray.forEach(resize => {
          if (typeof resize === 'function') {
            resize();
          } else {
            console.warn('resize-window plugin callback is not function!');
          }
        });
      }, option.timeout);
    }
  }
}