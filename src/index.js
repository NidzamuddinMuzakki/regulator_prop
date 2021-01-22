import 'react-app-polyfill/ie9'; // For IE 9-11 support
import 'react-app-polyfill/ie11'; // For IE 11 support
import './polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';
import userSettingSelected from './reducers/userSettingReducer';
import popup from './reducers/popup';
import {popupDepart, popupGroup, popupBranch, popupRole, popupMenu} from './reducers/PopAll'
import {rowperpageDepart,rowperpageGroup, rowperpageBranch, rowperpageRole,rowperpageUser, rowperpageMenu,rowperpageLog} from './reducers/rowPerpage'
import userAcces from './reducers/useracces';
import {MenuAccess,menupilihan } from './reducers/menuAcces';
const rootReducer =createStore(combineReducers({
    userSettingSelected, popup, popupDepart, popupGroup, popupBranch, popupRole, popupMenu,
    rowperpageDepart,rowperpageGroup, rowperpageBranch, rowperpageRole, rowperpageMenu, rowperpageUser, userAcces, MenuAccess, menupilihan,rowperpageLog
    
}),window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
ReactDOM.render(<Provider store={rootReducer}><App /></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
