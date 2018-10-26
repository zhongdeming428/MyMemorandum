import React from 'react';

class Dialog extends React.Component {
  constructor() {
    super();
    this.close = this.close.bind(this);
    this.modalClick = this.modalClick.bind(this);
    this.dialogClick = this.dialogClick.bind(this);
  }
  render() {
    return <div className="modal" onClick={this.modalClick} style={{ display: this.props.show ? '' : 'none'}}>
      <div className="dialog" onClick={this.dialogClick}>
        <div className="dialog-title">{ this.props.title }<span className="dialog-close" onClick={this.close}>+</span></div>
        <div className="dialog-content">
          {
            this.props.children
          }
        </div>
      </div>
    </div>
  }
  close() {
    this.props.close();
  }
  modalClick() {
    if (this.props.clickModal2Hide) {
      this.close();
    }
  }
  dialogClick(e) {
    e.stopPropagation();
  }
}

export default Dialog;