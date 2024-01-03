/**
 * @description Method that wraps the function passed to it in a timeout. Function passed will be executed after specified
 * time period, this is set by default to 600ms but can be passed as a parameter where the function is used.
 */
export function debounce(func: (...args: any[]) => any, timeout = 600) {
  let timer: any;
  return function(this: any, ...args: any[]) {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, timeout);
  };
}
