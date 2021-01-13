import React, { useContext, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { useMeasure } from "react-use";
import { UseMeasureRef } from "react-use/lib/useMeasure";
import { Context, Theme, Variant, variants } from "./context";
import { createBannerTemplate, createStyle } from "./hooks";

const Container = styled.pre`
  padding: 18px 26px;
  border-radius: 0.325em;

  font-size: 0.6rem;
  opacity: 0.65;
  white-space: initial;

  background-color: var(--subtle-background-color);
  user-select: all;
`;

export const Source: React.FC = (props) => {
  const context = useContext(Context);
  const [source, setSource] = useState("");

  useEffect(() => {
    const variant = variants[context.variant];

    const style = createStyle(variant);
    const template = createBannerTemplate(
      context.height,
      style,
      variant.icon,
      context.text
    );

    const formatted = template.trim();

    setSource(formatted);
  }, [context.height, context.text, context.variant]);

  return <Container>{source}</Container>;
};
