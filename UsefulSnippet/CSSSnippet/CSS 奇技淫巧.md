## 一、手写 Loading 动画

### （1）弹性加载动画

CSS 代码如下：

    .bounce-loading {
      width: 20rem;
      height: 10rem;
      background-color:aqua;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .bounce-loading > div {
      width: 1rem;
      height: 1rem;
      border-radius: 0.5rem;
      background-color:blueviolet;
      margin: 0 0.5rem;
      animation: bounce 1s infinite alternate;
    }
    @keyframes bounce {
      0% {
        transform: translateY(0);
        opacity: 1;
      }
      100% {
        transform: translateY(2rem);
        opacity: 0.1;
      }
    }
    .bounce-loading > div:nth-child(2) {
      animation-delay: 0.2s;
    }
    .bounce-loading > div:nth-child(3) {
      animation-delay: 0.4s;
    }

HTML 代码如下：

    <div class="bounce-loading">
      <div></div>
      <div></div>
      <div></div>
    </div>

效果如下：

![img](./gif/bounce-loading.gif)

### （2）旋转小圆圈

CSS 代码如下：

    .donut-loading {
      width: 2rem;
      height: 2rem;
      border-radius: 2rem;
      border: 3px solid rgba(0, 0, 0, 0.1);
      border-left-color: #7983ff;
      animation: rotate 1s infinite linear;
    }
    @keyframes rotate {
      from {
        transform: rotate(0deg)
      }
      to {
        transform: rotate(360deg)
      }
    }

HTML 代码如下：

    <div class="donut-loading"></div>
  
效果如下：

![img](./gif/donut-loading.gif)

## 二、构建一个宽高比固定的 div

CSS 代码如下：

    .reactive-height {
      width: 50%;
      background-color: aqua;
    }
    .reactive-height::before {
      content: '';
      float: left;
      padding-top: 100%;
    }
    .reactive-height::after {
      content: "";
      clear: both;
      display: table;
    }
  
HTML 代码如下：

    <div class="reactive-height"></div>

## 三、自定义滚动条

CSS 代码如下：

    .custom-scrollbar {
      width: 40rem;
      height: 7rem;
      background-color: aliceblue;
      overflow-y: scroll;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color:mediumpurple;
    }

HTML 代码如下：

    <div class="custom-scrollbar">
      <p>
        Pellentesque habitant morbi tristique senectus et 
        netus et malesuada fames ac turpis egestas. 
        Vestibulum tortor quam, feugiat vitae, 
        ultricies eget, tempor sit amet, ante. 
        Donec eu libero sit amet quam egestas semper. 
        Aenean ultricies mi vitae est. Mauris placerat 
        eleifend leo. Quisque sit amet est et sapien 
        ullamcorper pharetra. Vestibulum erat wisi, 
        condimentum sed, commodo vitae, ornare sit amet, 
        wisi. Aenean fermentum, elit eget tincidunt condimentum, 
        eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. 
        Donec non enim in turpis pulvinar facilisis. Ut felis. 
        Praesent dapibus, neque id cursus faucibus, tortor neque 
        egestas augue, eu vulputate magna eros eu erat. Aliquam 
        erat volutpat. Nam dui mi, tincidunt quis, accumsan 
        porttitor, facilisis luctus, metus
      </p>
    </div>
  
效果截图如下：

  ![img](./gif/custom-scrollbar.gif)

## 四、自定义文本选择时的样式

CSS 代码如下：

    .custom-text-selection {
      width: 50%;
    }
    .custom-text-selection::selection {
      background-color:navy;
      color: white;
    }

HTML 代码如下：

    <p class="custom-text-selection">
      Pellentesque habitant morbi tristique senectus et 
      netus et malesuada fames ac turpis egestas. 
      Vestibulum tortor quam, feugiat vitae, 
      ultricies eget, tempor sit amet, ante. 
      Donec eu libero sit amet quam egestas semper. 
      Aenean ultricies mi vitae est. Mauris placerat 
      eleifend leo. Quisque sit amet est et sapien 
      ullamcorper pharetra. Vestibulum erat wisi, 
      condimentum sed, commodo vitae, ornare sit amet, 
      wisi. Aenean fermentum, elit eget tincidunt condimentum, 
      eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. 
      Donec non enim in turpis pulvinar facilisis. Ut felis. 
      Praesent dapibus, neque id cursus faucibus, tortor neque 
      egestas augue, eu vulputate magna eros eu erat. Aliquam 
      erat volutpat. Nam dui mi, tincidunt quis, accumsan 
      porttitor, facilisis luctus, metus
    </p>

效果截图如下：

![img](./gif/custom-text-selection.gif)

## 五、禁止文本被选中

CSS 代码如下：

    .disable-selection {
      width: 50%;
      user-select: none;
    }

HTML 代码如下：

    <p class="disable-selection">
      Pellentesque habitant morbi tristique senectus et 
      netus et malesuada fames ac turpis egestas. 
      Vestibulum tortor quam, feugiat vitae, 
      ultricies eget, tempor sit amet, ante. 
      Donec eu libero sit amet quam egestas semper. 
      Aenean ultricies mi vitae est. Mauris placerat 
      eleifend leo. Quisque sit amet est et sapien 
      ullamcorper pharetra. Vestibulum erat wisi, 
      condimentum sed, commodo vitae, ornare sit amet, 
      wisi. Aenean fermentum, elit eget tincidunt condimentum, 
      eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. 
      Donec non enim in turpis pulvinar facilisis. Ut felis. 
      Praesent dapibus, neque id cursus faucibus, tortor neque 
      egestas augue, eu vulputate magna eros eu erat. Aliquam 
      erat volutpat. Nam dui mi, tincidunt quis, accumsan 
      porttitor, facilisis luctus, metus
    </p>

## 六、渐变色文本

HTML 代码如下：

    <p class="gradient-text">
      gradient-text
    </p>

CSS 代码如下：

    .gradient-text {
      background: -webkit-linear-gradient(pink, red);
      -webkit-text-fill-color: transparent;
      -webkit-background-clip: text;
    }

效果截图如下：

![img](./gif/gradient-text.gif)

## 七、Hover 下划线效果

该部分实现一个鼠标移入时的下划线变化效果，共用一段 HTML 代码，代码如下：

    <p class="hover-underline-animation">
      Hover Underline Animation
    </p>

各部分实现效果的 CSS 代码各异，将分别给出。

### （1）从中间开始变化

CSS 代码如下：

    .hover-underline-animation {
      cursor: pointer;
    }
    .hover-underline-animation::after {
      content: '';
      width: 100%;
      height: 2px;
      display: block;
      background-color: #7983ff;
      transform: scaleX(0);
      transition: transform 0.3s;
    }
    .hover-underline-animation:hover::after {
      transform: scaleX(1);
    }

效果截图如下：

  ![img](./gif/hover-underline-animation.gif)

### （2）从左至右变化

CSS 代码如下：

    .hover-underline-animation {
      cursor: pointer;
    }
    .hover-underline-animation::after {
      content: '';
      width: 100%;
      height: 2px;
      display: block;
      background-color: #7983ff;
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.3s;
    }
    .hover-underline-animation:hover::after {
      transform: scaleX(1);
      transform-origin: left;
    }

效果截图如下：

![img](./gif/hover-underline-animation-1.gif)

### （3）实现左入左出、右入右出的效果

这一部分 HTML 代码略有不同，为了展示左入左出、右入右出的效果，需要三个元素来实现，所以 HTML 代码多了两个相同的元素：

    <span class="hover-underline-animation">
      Hover Underline Animation
    </span>
    <span class="hover-underline-animation">
      Hover Underline Animation
    </span>
    <span class="hover-underline-animation">
      Hover Underline Animation
    </span>

CSS 代码如下;

    .hover-underline-animation {
      cursor: pointer;
      position: relative;
    }
    .hover-underline-animation::after {
      content: '';
      position: absolute;
      right: 0;
      bottom: 0;
      width: 0%;
      height: 2px;
      display: block;
      background-color: #7983ff;
      transition: all 0.3s;
    }
    .hover-underline-animation:hover::after {
      width: 100%;
    }
    .hover-underline-animation:hover ~ .hover-underline-animation::after {
      right: 100% !important;
    }

效果截图如下：

![img](./gif/hover-underline-animation-2.gif)

## 八、:not 选择器

HTML 代码如下：

    <ul class="not-selector" type="none">
      <li>One</li>
      <li>Two</li>
      <li>Three</li>
      <li>Four</li>
    </ul>

CSS 代码如下：

    .not-selector > li {
      width: 20rem;
      position: relative;
    }
    .not-selector > li:not(:last-child)::after {
      content: "";
      display: inline-block;
      background-color: #c3c3c3;
      height: 0.5px;
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
    }

实现效果如下：

![img](./gif/not-selector.gif)

## 九、滚动容器的渐变遮罩

HTML 代码如下：

    <div class="overflow-scroll-gradient dn">
      <div>
        Pellentesque habitant morbi tristique senectus et 
        netus et malesuada fames ac turpis egestas. 
        Vestibulum tortor quam, feugiat vitae, 
        ultricies eget, tempor sit amet, ante. 
        Donec eu libero sit amet quam egestas semper. 
        Aenean ultricies mi vitae est. Mauris placerat 
        eleifend leo. Quisque sit amet est et sapien 
        ullamcorper pharetra. Vestibulum erat wisi, 
        condimentum sed, commodo vitae, ornare sit amet, 
        wisi. Aenean fermentum, elit eget tincidunt condimentum, 
        eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. 
        Donec non enim in turpis pulvinar facilisis. Ut felis. 
        Praesent dapibus, neque id cursus faucibus, tortor neque 
        egestas augue, eu vulputate magna eros eu erat. Aliquam 
        erat volutpat. Nam dui mi, tincidunt quis, accumsan 
        porttitor, facilisis luctus, metus
      </div>
    </div>

CSS 代码如下：

    .overflow-scroll-gradient {
      position: relative;
    }
    .overflow-scroll-gradient::before {
      content: "";
      display: inline-block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 5rem;
      background: linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.001))
    }
    .overflow-scroll-gradient::after {
      content: "";
      display: inline-block;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 5rem;
      background: linear-gradient(rgba(255, 255, 255, 0.001), rgba(255, 255, 255, 1))
    }
    .overflow-scroll-gradient > div {
      width: 15rem;
      height: 25rem;
      overflow-y: scroll;
    }

效果截图如下：

![img](./gif/overflow-scroll-gradient.gif)

## 十、使用系统字体获得原生体验

HTML 代码：

    <p class="system-font-stack">This text uses the system font.</p>
  
CSS 代码如下：

    .system-font-stack {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }

我在 Ubuntu 系统下显示效果如下：

![img](./gif/system-font.png)

## 十一、圆润的 checkbox

HTML 代码如下：

    <div>
      <input type="checkbox" id="toggle" class="offscreen">
      <label for="toggle" class="checkbox"></label>
    </div>

CSS 代码如下：

    .offscreen {
      display: none;
    }
    .checkbox {
      width: 40px;
      height: 20px;
      border-radius: 20px;
      display: inline-block;
      background-color: rgba(0, 0, 0, 0.25);
      position: relative;
      cursor: pointer;
    }
    .checkbox::before {
      content: "";
      width: 18px;
      height: 18px;
      border-radius: 18px;
      background-color: white;
      position: absolute;
      left: 1px;
      top: 1px;
      transition: transform .3s ease;
    }
    #toggle:checked + .checkbox {
      background-color: #7983ff;
    }
    #toggle:checked + .checkbox::before {
      transform: translateX(20px);
    }

效果截图如下：

![img](./gif/checkbox-1.png)
![img](./gif/checkbox-2.png)

## 十二、绘制一个三角形

HTML 代码如下：

    <div class="triangle"></div>

CSS 代码如下：

    .triangle {
      width: 0;
      height: 0;
      border: 1rem solid transparent;
      border-bottom: 3rem solid blue;
    }

利用 CSS border 的特性绘制三角形，改变 border 的宽度，可以绘制不同特性的三角形。

## 十三、过长的文本用省略号代替

HTML 代码如下：

    <p class="truncate-text">
      This text will be truncated with ellipse ......
    </p>

CSS 代码如下：

    .truncate-text {
      width: 19rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      background-color: #c3c3c3
    }

效果截图如下;

![img](./gif/truncate-text.png)