import { combineReducers } from 'redux';
import { fromJS, List } from 'immutable';

function todoItems(todoItems = [], action) {
    let _todoItems = List(todoItems);
    let { type, data } = action;
    switch(type) {
        case 'ADD_TODOITEMS': _todoItems = _todoItems.push(data);break;
        case 'DELETE_TODOITEMS': _todoItems = _todoItems.splice(_todoItems.indexOf(data), 1);break;
    }
    console.log("_todoItems=>" + _todoItems);
    console.log("todoItems=>" + _todoItems.toJS());
    return _todoItems.toJS();
}

export default combineReducers({
    todoItems
});