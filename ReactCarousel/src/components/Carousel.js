import React from 'react';

const goNext = function() {
  if (this.state.cur === this.state.imgs.length - 1) return;
  this.setState({
    cur: this.state.cur + 1
  });
  let timeDuration = this.state.timeDuration;
  if (this.state.cur === this.state.imgs.length - 2) {
    this.setState({
      cur: 0,
      timeDuration: 0
    })
    window.setTimeout(() => {
      this.setState({
        timeDuration: timeDuration
      });
    }, 100);
  }
}

const goPrev = function() {
  let timeDuration = this.state.timeDuration;
  if (this.state.cur === 0) {
    this.setState({
      cur: this.state.imgs.length - 1,
      timeDuration: 0
    });
    window.setTimeout(() => {
      this.setState({
        timeDuration: timeDuration
      });
    }, 100);
    return;
  }
  this.setState({
    cur: this.state.cur - 1
  });
}

class Carousel extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.state = {
      cur: 0,
      width: this.props.width,
      height: this.props.height,
      imgs: [this.props.imgs[this.props.imgs.length - 1], ...this.props.imgs, this.props.imgs[0]],
      urls: [this.props.urls[this.props.urls.length - 1], ...this.props.urls, this.props.urls[0]],
      showBtn: this.props.showBtn,
      autoSwipe: this.props.autoSwipe,
      timeDuration: this.props.timeDuration
    };
    this.goNext = goNext.bind(this);
    this.goPrev = goPrev.bind(this);
  }
  render() {
    return <div style={{width: this.state.width, height: this.state.height,overflow: 'hidden', position: 'relative'}}>
      <div style={{width: this.state.imgs.length*100 + '%', height: '100%', transition: `transform ${this.state.timeDuration/1000}s`, transform: `translateX(-${this.state.cur*100/this.state.imgs.length}%)`}}>
        {
          this.state.imgs.map((img, i) => <img key={i} src={img} style={{float: 'left', width: 1/this.state.imgs.length*100 + "%", height: '100%'}}/>)
        }
      </div>
      {
        this.state.showBtn ? <div className="btn prev-btn" onClick={this.goPrev}></div> : null
      }
      {
        this.state.showBtn ? <div className="btn next-btn" onClick={this.goNext}></div> : null
      }
    </div>
  }
}

export default Carousel;