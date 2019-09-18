import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {AppStore} from './store/AppStore';
import {AppStoreContext} from './store/AppStoreContext';
import {App} from './components/App';

ReactDOM.render(
    <AppStoreContext.Provider value={new AppStore()}>
        <App />
    </AppStoreContext.Provider>,
    document.getElementById("app")
);