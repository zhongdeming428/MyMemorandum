import React from 'react';

class Dialog extends React.Component {
  constructor() {
    super();
    this.modalHandler = (e) => {
      this.setState({
        data: e.detail.data,
        visible: true
      });
    };
    this.state = {
      data: {
        title: '',
        content: ''
      },
      visible: false
    };
    this.close = this.close.bind(this);
    this.modalClick = this.modalClick.bind(this);
  }
  render() {
    return <div className="modal" onClick={this.modalClick} style={{ display: this.state.visible ? '' : 'none'}}>
      <div className="dialog">
        <div className="dialog-title">{ this.state.data.title }<span className="dialog-close" onClick={this.close}>+</span></div>
        <div className="dialog-content">
          {
            this.state.data.content
          }
        </div>
      </div>
    </div>
  }
  componentDidMount() {
    document.addEventListener('modal', this.modalHandler);
  }
  componentWillUnmount() {
    document.removeEventListener('modal',this.modalHandler);
  }
  close() {
    this.setState({
      visible: false
    })
  }
  static show(data) {
    document.dispatchEvent(new CustomEvent('modal', {
      detail: {
        data
      }
    }));
  }
  modalClick() {
    if (this.props.clickModal2Hide) {
      this.close();
    }
  }
}

export default Dialog;