(function(window) {
  var el, div, timer, timer1, mouseX, config,
    imgs = [],
    cur = 0;
  var style = {
    overflow: 'hidden'
  };
  // Strategy 
  var strategies = {
    style() {
      for (let key in config[style]) {
        el.style[key] = config[style][key];
      }
    },
    imgs() {
      var fragment = window.document.createDocumentFragment();
      div = window.document.createElement('div');
      config['imgs'].forEach((img, i) => {
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
      div.style.width = el.offsetWidth * config['imgs'].length + 'px';
    },
    draggable() {
      if (config.draggable) attachSwipeEvent();
    },
    showBtn() {
      if(!config.showBtn) {
        let nodes = window.document.querySelectorAll('.carousel-left, .carousel-right');
        for (let i=0; i<nodes.length; i++) {
          nodes[i].style.display = 'none';
        }
      } else {
        attachBtnEvent();
      }
    },
    autoSwipe() {
      if (config.autoSwipe) setAuto();
    },
    urls() {
      if (config.urls instanceof Array) {
        if (config.urls.length !== imgs.length) throw new TypeError('urls 配置项的长度必须与图片数量相匹配！')
        else {
          for (let i=0; i<imgs.length; i++) {
            imgs[i].addEventListener('click', function() {
              window.open(config.urls[i]);
            });
          }
        }
      }
    }
  };
  function carousel(selector, options) {
    config = options;
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
        strategies[key] && strategies[key]();
      }
      lazyLoad(options.imgs);
    }
  }
  function attachBtnEvent() {
    window.document.querySelector('.carousel-left').addEventListener('click', function() {
      window.clearInterval(timer);
      goPrev();
      if (config.autoSwipe) timer1 = window.setTimeout(setAuto, 2000);
    });
    window.document.querySelector('.carousel-right').addEventListener('click', function() {
      window.clearInterval(timer);
      goNext();
      if (config.autoSwipe) timer1 = window.setTimeout(setAuto, 2000);
    });
  }
  function attachSwipeEvent() {
    div.addEventListener('mousedown', swipeStart);
    div.addEventListener('mouseup', swipeEnd);
  }
  function goPrev() {
    if (cur >= 1) {
      cur--;
      div.style.transform = `translateX(-${cur*el.offsetWidth}px)`;
    }
  }
  function goNext() {
    if (cur < imgs.length - 1) {
      cur++;
      div.style.transform = `translateX(-${cur*el.offsetWidth}px)`;
    }
  }
  function swipeStart(e) {
    mouseX = e.clientX;
    window.clearInterval(timer);
  }
  function swipeEnd(e) {
    if (e.clientX - mouseX < 0) {
      goNext();
    } else if (e.clientX - mouseX > 0) {
      goPrev();
    }
    if (config.autoSwipe) setAuto();
  }
  function lazyLoad(imgUrls) {
    if (imgs.length > 3) {
      for (let i=3; i < imgs.length; i++) {
        imgs[i].src = imgUrls[i];
      }
    }
  }
  function setAuto() {
    window.clearTimeout(timer1);
    timer = window.setInterval(function() {
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
  if (module.exports) {
    module.exports = carousel;
  }
})(window)