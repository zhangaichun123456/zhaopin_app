import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import thunk from 'redux-thunk'
import reducers from './reducer'

import {Provider} from 'react-redux'
import {BrowserRouter} from 'react-router-dom'

import {createStore,applyMiddleware,compose} from 'redux'



import './config'
import './index.css'



import App from './app'

const store = createStore(reducers, compose(
	applyMiddleware(thunk),
	window.devToolsExtension ? window.devToolsExtension() : f => f
))


ReactDOM.render(
	(
		<Provider store={store}>
		    <BrowserRouter>
			    <App></App>
		    </BrowserRouter>
	    </Provider>
	),
	document.getElementById('root')
);
registerServiceWorker();