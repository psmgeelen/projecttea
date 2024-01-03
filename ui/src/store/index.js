import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

// slices
import { ALL_APP_SLICES } from "./slices";

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
  const store = configureStore({
    reducer: reducers,
    preloadedState: state,
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(eventsListener.middleware),
  });
  const provider = (
    <Provider store={store}>
      {children}
    </Provider>
  );

  if (returnStore) return { store, provider };
  return provider;
};

export { AppStore };