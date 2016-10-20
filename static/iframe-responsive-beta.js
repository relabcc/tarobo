/*
  iFrameResponsive.js
  by Lackneets Chang < lackneets@gmail.com >
*/
(function(){

  // Polyfill
  // http://javascript.boxsheep.com/polyfills/Array-prototype-forEach/
  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (fn, arg) {
      var arr = this,
      len = arr.length,
      thisArg = arg ? arg : undefined,
      i;
      for (i = 0; i < len; i += 1) {
        if (arr.hasOwnProperty(i)) {
          fn.call(thisArg, arr[i], i, arr);
        }
      }
      return undefined;
    };
  }
  if(!CSSStyleDeclaration.prototype.setProperty){
    CSSStyleDeclaration.prototype.getProperty = function(a) {
      return this.getAttribute(a);
    };
    CSSStyleDeclaration.prototype.setProperty = function(a,b) {
      return this.setAttribute(a,b);
    }
    CSSStyleDeclaration.prototype.removeProperty = function(a) {
      return this.removeAttribute(a);
    }
  }

  function isJSON (str) {
    try {
      return JSON.parse(str) && true;
    } catch (ex) {
      return false;
    }
  }

  function toArray(obj) {
    var array = [];
    for (var i = obj.length >>> 0; i--;) {
      array[i] = obj[i];
    }
    return array;
  }

  function attachEvent(element, event, fn) {
    if (element.addEventListener) {
      element.addEventListener(event, fn, false);
    } else if (element.attachEvent) { // if IE
      element.attachEvent('on' + event, fn);
    }
  }

  var onReady = function(fn) {

    if (document.readyState == 'complete'){

      fn();

    }else if(document.addEventListener){

      if(typeof Turbolinks != 'undefined'){
        window.addEventListener('turbolinks:load', fn, false);

      }else{
        window.addEventListener('load', fn, false);

      }
    }else{

      window.attachEvent('onload', fn);

    }

  }

  onReady(function(){

    // Master
    var resizedFrames = [];

    attachEvent(window, 'message', onResized);
    function onResized(event){
      var data = isJSON(event.data) ? JSON.parse(event.data) : event.data;
      if(data.location){
        toArray(document.getElementsByTagName('iframe')).forEach(function(frame){
          if(data.location == frame.src.toString().replace(/#.+$/, '')){
            frame.style.setProperty("height", data.height + "px", "important");
            resizedFrames.push(frame);
          }
        });
      }
    }

    // iFrame
    if(window.parent != window && window.parent.postMessage){
      function sendHeight(){
        parent.postMessage(JSON.stringify({
          height: document.body.scrollHeight-10, // auto decreace 10px
          location: window.location.toString().replace(/#.+$/, '')
        }), '*');
      }

      document.body.style.overflowY = "hidden";
      setInterval(sendHeight, 10);
    }

  });

})();