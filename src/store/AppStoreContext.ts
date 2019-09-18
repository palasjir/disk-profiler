import * as React from 'react';
import {AppStore} from './AppStore';

export const AppStoreContext = React.createContext<AppStore | null>(null);