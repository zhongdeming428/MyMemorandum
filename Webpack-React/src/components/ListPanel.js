import React from 'react';
import { connect } from 'react-redux';
import { todoItems } from '@/store/actions';

class _ListPanel extends React.Component {
    constructor() {
        super();
        this.state = {
            newItem: ''
        };
        this.addTodoItems = this.addTodoItems.bind(this);
        this.inputItem = this.inputItem.bind(this);
    }
    render() {
        return <div className="list-panel">
            <div className="list-panel-input">
                <input type="text" onInput={this.inputItem}></input>
                <input type="button" onClick={this.addTodoItems} value="添加"></input>
            </div>
            <div>
                {
                    this.props.items.map((item, index) => {
                        return <div key={index}>
                            {item}
                        </div>
                    })
                }
            </div>
        </div>
    }
    addTodoItems() {
        this.props.addTodoItems(this.state.newItem);
    }
    inputItem(e) {
        this.setState({
            newItem: e.target.value
        });
    }
}

const mapState2Props = (state) => {
    return {
        items: state.todoItems
    };
}

const mapDispatch2Props = dispatch => {
    return {
        addTodoItems(data) {
            dispatch(todoItems('ADD_TODOITEMS', data));
        },
        delTodoItems(data) {
            dispatch(todoItems('DELETE_TODOITEMS', data));
        }
    };
};

const ListPanel = connect(mapState2Props, mapDispatch2Props)(_ListPanel);

export default ListPanel;