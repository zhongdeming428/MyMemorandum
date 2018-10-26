import React from 'react';

class Dialog extends React.Component {
  constructor() {
    super();
    this.close = this.close.bind(this);
  }
  render() {
    return <div className="modal" style={{ display: this.props.show ? '' : 'none' }}>
      <div className="dialog">
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
    this.props.onClose();
  }
}

export default Dialog;