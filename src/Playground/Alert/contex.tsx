import React, { useEffect, useRef, useState } from "react";
import { Variant } from "../context";

interface AlertContextModel {
  contentHeight: number;
  actions: {
    setContentHeight: (height: number) => void;
  };
}

export const AlertContext = React.createContext<AlertContextModel>(null as any);

const INITIAL_TEXT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.!";

interface Props {
  variant: Variant;
}

export const Alert: React.FC<Props> = (props) => {
  const head = useRef<HTMLHeadElement>(null);
  const body = useRef<HTMLBodyElement>(null);

  useEffect(() => {}, []);

  const [contentHeight, setContentHeight] = useState(0);

  const state: AlertContextModel = {
    contentHeight,
    actions: {
      setContentHeight,
    },
  };

  return (
    <AlertContext.Provider value={state}>
      {props.children}
    </AlertContext.Provider>
  );
};
