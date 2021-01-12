import React, { useEffect, useMemo, useRef, useState } from "react";
import { useHeight } from "./hooks";

export const MIN_WIDTH = 300;

export type Theme = "dark" | "light";
export type Variant = "info" | "warning" | "error";

export interface Alert {
  icon: string;
  colors: {
    text: string;
    code: string;
    background: string;
  };
}

export const variants: Record<Variant, Alert> = {
  info: {
    icon: "🛈",
    colors: {
      text: "#55687d",
      code: "#79b8ff40",
      background: "#79b8ff40",
    },
  },
  warning: {
    icon: "⚠",
    colors: {
      text: "#ef690c",
      code: "#f67f182b",
      background: "#ff963e40",
    },
  },
  error: {
    icon: "🗙",
    colors: {
      text: "#ff7b72",
      code: "#ff938c47",
      background: "#ff938c47",
    },
  },
};

interface ContextModel {
  theme: Theme;
  variant: Variant;
  text: string;
  height: number;
  actions: {
    setText: (text: string) => void;
    setTheme: (theme: Theme) => void;
    setVariant: (variant: Variant) => void;
  };
}

export const Context = React.createContext<ContextModel>(null as any);

const INITIAL_TEXT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris!";

const useTheme = () => {
  const [theme, setTheme] = useState<ContextModel["theme"]>("light");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return {
    theme,
    setTheme,
  };
};

export const ContextProvider: React.FC = (props) => {
  const [text, setText] = useState(INITIAL_TEXT);
  const [variant, setVariant] = useState<Variant>("warning");

  const height = useHeight({
    text,
    variant,
  });

  const { theme, setTheme } = useTheme();

  const actions = useMemo(
    () => ({
      setText,
      setTheme,
      setVariant,
    }),
    [setTheme]
  );

  const state: ContextModel = {
    theme,
    height,
    text,
    variant,
    actions,
  };

  return <Context.Provider value={state}>{props.children}</Context.Provider>;
};
