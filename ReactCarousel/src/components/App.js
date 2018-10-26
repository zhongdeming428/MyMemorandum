import React from 'react';
import Carousel from './Carousel';
import Dialog from './Dialog';

const options = {
  width: '66%',
  height: '20%',
  // imgs: ['http://i1.letvimg.com/lc05_qmt/201710/15/17/00/defzxn4eqx6m/169.jpg','http://img.mp.itc.cn/upload/20161020/8a8a49fcc094473b96460973aa3b59fe_th.png','http://www.sxdaily.com.cn/NMediaFile/2013/1105/SXRB201311051455000090242434446.jpg','http://news.xinhuanet.com/sports/2017-10/15/1121806284_15080784732771n.jpg'],
	// urls: ['http://i1.letvimg.com/lc05_qmt/201710/15/17/00/defzxn4eqx6m/169.jpg','http://img.mp.itc.cn/upload/20161020/8a8a49fcc094473b96460973aa3b59fe_th.png','http://www.sxdaily.com.cn/NMediaFile/2013/1105/SXRB201311051455000090242434446.jpg','http://news.xinhuanet.com/sports/2017-10/15/1121806284_15080784732771n.jpg'],
  imgs: [],
  urls: [],
  timeDuration: 1000,
  autoSwipe: true,
  showBtn: true
};

class App extends React.Component {
  constructor(props) {
    super();
    this.state = {
      visible: true
    };
  }
  render() {
    return <div className="content">
      <Carousel imgs={options.imgs}
                urls={options.urls}
                timeDuration={options.timeDuration}
                autoSwipe={options.autoSwipe}
                showBtn={options.showBtn}
                height={options.height}
                width={options.width}/>
      <Dialog show={this.state.visible} title="Test" onClose={()=>{this.setState({visible: false})}}>
        <div style={{backgroundColor:'',width: '500px',height: '300px'}}></div>
      </Dialog>
    </div>
  }
}

export default App;