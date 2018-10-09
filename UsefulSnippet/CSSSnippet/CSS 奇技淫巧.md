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

