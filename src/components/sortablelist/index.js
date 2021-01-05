import React from 'react';
import ReactDOM from 'react-dom';
import SortableList from './SortableList';

import './styles.css';
import 'react-sortable-tree/style.css';

const rootElement = document.getElementById('root');
ReactDOM.render(<SortableList />, rootElement);
