import { createContext, useState } from "react";

const initialState = {
  data: null,
  loading: false,
  loadingPhase: null,
  timeToLoadMS: null,
  selectedArticle: null,
  graphMode: "citations",
};

export const NetworkGraphContext = createContext({});

export function NetworkGraphProvider({ children }) {
  const [state, setStateInternal] = useState({ ...initialState });

  function setState(newstate) {
    setStateInternal((prev) => {
      const final = { ...prev, ...newstate };
      return final;
    });
  }

  const value = {
    ...state,
    setState,
  };

  return (
    <NetworkGraphContext.Provider value={value}>
      {children}
    </NetworkGraphContext.Provider>
  );
}

export default NetworkGraphProvider;
