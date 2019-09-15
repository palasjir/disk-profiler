import * as React from 'react';
import {MainStore} from './mainStore';

export const MainStoreContext = React.createContext<MainStore | null>(null);