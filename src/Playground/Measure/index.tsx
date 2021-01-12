import React, {
  IframeHTMLAttributes,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import styled, { css, keyframes } from "styled-components";
import { useMeasure } from "react-use";
import { UseMeasureRef } from "react-use/lib/useMeasure";
import ResizeObserver from "resize-observer-polyfill";

const Indicator = styled.div`
  opacity: 0.5;

  user-select: none;

  font-family: monospace;
  font-weight: normal;
  font-size: 0.8em;

  &:before {
    content: "";

    position: absolute;
    z-index: -1;

    border: 1px dashed #bbbbbb;
  }
`;

export const WidthIndicator = styled(Indicator)<{ width: number }>`
  padding-bottom: 2em;

  display: flex;
  justify-content: center;
  position: relative;

  &:before {
    content: "";

    left: 0;
    right: 0;
    bottom: 1em;

    border-bottom: none;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;

    height: 6px;
  }
`;

export const HeightIndicator = styled(Indicator)<{ height: number }>`
  padding-right: 2.25em;

  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  left: 0;
  bottom: 0;
  height: ${(props) => props.height}px;

  transform: translateX(-100%);

  &:before {
    content: "";

    top: 0;
    right: 1em;
    bottom: 0;

    border-right: none;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;

    width: 6px;
  }
`;
