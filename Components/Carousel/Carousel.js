(function(window) {
  var el, div
    imgs = [],
    cur = 0;
  var style = {
    overflow: 'hidden'
  };
  // Strategy 
  var strategies = {
    style(options) {
      for (let key in options[style]) {
        el.style[key] = options[style][key];
      }
    },
    imgs(options) {
      var fragment = window.document.createDocumentFragment();
      div = window.document.createElement('div');
      options['imgs'].forEach((img, i) => {
        let imgEl = window.document.createElement('img');
        if (i < 3) imgEl.src = img;
        fragment.appendChild(imgEl);
        imgEl.style.width = el.offsetWidth + 'px';
        imgEl.style.height = '100%';
        imgEl.style.float = 'left';
        imgs.push(imgEl);
      });
      div.appendChild(fragment);
      el.appendChild(div);
      div.style.height = '100%';
      div.style.width = el.offsetWidth * options['imgs'].length + 'px';
    }
  };
  function carousel(selector, options) {
    var nodes = window.document.querySelectorAll(selector);
    if (nodes.length !== 1) {
      throw new TypeError('Invalid selector!');
    } else {
      el = nodes[0];
      el.innerHTML = [
        '<div class="carousel-left"></div>',
        '<div class="carousel-right"></div>'
      ].join('');
      for (let key in style) {
        el.style[key] = style[key];
      }
      for (let key in options) {
        strategies[key] && strategies[key](options);
      }
      attachEvent();
      lazyLoad(options.imgs);
      // setAuto();
    }
  }
  function attachEvent() {
    window.document.querySelector('.carousel-left').addEventListener('click', goPrev);
    window.document.querySelector('.carousel-right').addEventListener('click', goNext);
  }
  function goPrev(e) {
    if (cur >= 1) {
      cur--;
      div.style.transform = `translateX(-${cur*el.offsetWidth}px)`;
    }
  }
  function goNext(e) {
    if (cur < imgs.length - 1) {
      cur++;
      div.style.transform = `translateX(-${cur*el.offsetWidth}px)`;
    }
  }
  function lazyLoad(imgUrls) {
    if (imgs.length > 3) {
      for (let i=3; i < imgs.length; i++) {
        imgs[i].src = imgUrls[i];
      }
    }
  }
  function setAuto() {
    window.setInterval(function() {
      if (cur < imgs.length - 1) {
        goNext();
      } else {
        cur = 0;
        div.style.transition = 'unset';
        div.style.transform = 'translateX(0)';
        div.style.transition = 'all 2s';
      }
    }, 2000);
  }
  window.carousel = carousel;
})(window)