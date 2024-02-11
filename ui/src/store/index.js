import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import {
  persistReducer, persistStore,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER
} from "redux-persist";
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

// slices
import { ALL_APP_SLICES } from "./slices";
import { PersistGate } from "redux-persist/integration/react";

// listeners
// import { eventsListener } from "./listeners";

function buildAppStore(preloadedState) {
  const slices = ALL_APP_SLICES;
  const reducers = {};
  const state = {};
  Object.keys(slices).forEach(key => {
    reducers[key] = slices[key].reducer;
    const defaultState = slices[key].getInitialState();
    state[key] = defaultState;

    if (key in preloadedState) {
      // if default state is an object, merge it with the preloaded state
      if (typeof defaultState === 'object') {
        const preloadedStateForKey = preloadedState[key] || {};
        state[key] = { ...defaultState, ...preloadedStateForKey };
      } else { // otherwise, just use the preloaded state
        state[key] = preloadedState[key];
      }
    }
  });

  return { reducers, state };
}

// AppStore is a wrapper component that provides the Redux store to the rest of the application.
// preloadedState is an optional parameter that allows you to pass in an initial state for the store.
const AppStore = ({ children, preloadedState = {}, returnStore = false }) => {
  const { reducers, state } = buildAppStore(preloadedState);
  // create a persisted reducer
  const persistedReducer = persistReducer(
    {
      key: 'root',
      storage,
      whitelist: ['UI']
    },
    combineReducers(reducers)
  );

  const store = configureStore({
    reducer: persistedReducer,
    preloadedState: state,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      }
    })
  });
  const persistor = persistStore(store);

  const provider = (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );

  if (returnStore) return { store, provider, persistor };
  return provider;
};

export { AppStore };