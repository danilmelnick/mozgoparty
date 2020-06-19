import React, {Component} from 'react';
import {Navigation} from './app/router/Navigation';
import { Provider } from 'react-redux';
import store from './app/store'

export const App = () => <Provider store={ store }><Navigation/></Provider>

export default App