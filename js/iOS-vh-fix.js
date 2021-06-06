var iOSvhFix = new function () {
  var me = this,
    iosViewportHeightEl,
    realViewportHeightEl,
    styleEl;

  // from https://github.com/rodneyrehm/viewport-units-buggyfill/blob/master/viewport-units-buggyfill.js
  function debounce(func, wait) {
    var timeout;
    return function() {
      var context = this;
      var args = arguments;
      var callback = function() {
        func.apply(context, args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(callback, wait);
    };
  }


  me.setCSSVariables = function (e) {

    if (e) {
      console.log(e.type);
    }

    requestAnimationFrame(function () {
      styleEl.textContent = `
        html { 
          --iOS-vh-fix--vh: ${iosViewportHeightEl.innerHeight}px;
          --iOS-vh-fix--chrome-height: ${realViewportHeightEl.offsetHeight - iosViewportHeightEl.offsetHeight}px;
        }`
      iosViewportHeightEl.innerHTML = (`${iosViewportHeightEl.offsetHeight}, ${realViewportHeightEl.offsetHeight}`);  
    });
  }

  function iOSViewportChangeEvent(e) {
    console.log('iframe' + e.type + new Date().getTime());
    setTimeout(me.setCSSVariables, 100);
  }

  me.init = function () {
    styleEl = document.createElement('style');
    styleEl.id = 'iOS-vh-fix-styles';
    document.head.appendChild(styleEl);

    iosViewportHeightEl = document.createElement('iframe');
    iosViewportHeightEl.className = 'iOS-vh-fix--iOS-viewport';
    iosViewportHeightEl.src = '';

    realViewportHeightEl = document.createElement('div');
    realViewportHeightEl.className = 'iOS-vh-fix--real-viewport';
    
    document.body.appendChild(iosViewportHeightEl);
    document.body.appendChild(realViewportHeightEl);

    me.setCSSVariables();
    
    window.addEventListener('scroll', debounce(me.setCSSVariables, 150));
    window.addEventListener('resize', debounce(me.setCSSVariables, 250));
    document.body.addEventListener('touchstart', function(e) {
      e.preventDefault();
    }, false);
    iosViewportHeightEl.addEventListener('resize', iOSViewportChangeEvent);
  }
}

iOSvhFix.init();