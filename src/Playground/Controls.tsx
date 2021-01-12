import React, { useContext, useRef } from "react";
import styled, { css } from "styled-components";
import { useMeasure } from "react-use";
import { UseMeasureRef } from "react-use/lib/useMeasure";
import { Context, Theme, Variant } from "./context";

const Container = styled.div`
  /* padding: 24px 32px; */
  /* border-radius: 0.325em; */

  display: grid;
  grid-auto-flow: column;
  justify-content: flex-start;
  grid-gap: 16px;

  padding-top: 0.5rem;
  padding-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.2em;
    font-size: 0.75em;
    opacity: 0.8;
  }
`;

const Select = styled.select`
  padding: 5px 32px 5px 16px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;

  user-select: none;
  border: 1px solid;
  border-radius: 6px;
  appearance: none;

  background: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjI1NXB4IiBoZWlnaHQ9IjI1NXB4IiB2aWV3Qm94PSIwIDAgMjU1IDI1NSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjU1IDI1NTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPGcgaWQ9ImFycm93LWRyb3AtZG93biI+DQoJCTxwb2x5Z29uIHBvaW50cz0iMCw2My43NSAxMjcuNSwxOTEuMjUgMjU1LDYzLjc1IAkJIi8+DQoJPC9nPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=")
    no-repeat right;
  background-size: 10px;
  background-position: calc(100% - 12px);
  color: var(--color-btn-text);
  background-color: var(--color-btn-bg);
  border-color: var(--color-btn-border);
  box-shadow: var(--color-btn-shadow), var(--color-btn-inset-shadow);
  transition: 0.2s cubic-bezier(0.3, 0, 0.5, 1);
  transition-property: color, background-color, border-color;

  text-transform: capitalize;
  position: relative;

  &:after {
    margin-left: 4px;
    opacity: 0.8;

    display: inline-block;
    width: 0;
    height: 0;
    vertical-align: middle;
    content: "▾";
    border-top-style: solid;
    border-top-width: 4px;
    border-right: 4px solid transparent;
    border-bottom: 0 solid transparent;
    border-left: 4px solid transparent;
  }
`;

export const Controls: React.FC = (props) => {
  const context = useContext(Context);

  const themes: Theme[] = ["dark", "light"];
  const variants: Variant[] = ["info", "warning", "error"];

  return (
    <Container>
      <div>
        <label htmlFor="variant">Variant</label>

        <Select
          name="variant"
          value={context.variant}
          onChange={(event) =>
            context.actions.setVariant(event.target.value as Variant)
          }
        >
          {variants.map((variant) => (
            <option key={variant} value={variant}>
              {variant}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label htmlFor="theme">Theme</label>

        <Select
          name="theme"
          value={context.theme}
          onChange={(event) =>
            context.actions.setTheme(event.target.value as Theme)
          }
        >
          {themes.map((theme) => (
            <option key={theme} value={theme}>
              {theme}
            </option>
          ))}
        </Select>
      </div>
    </Container>
  );
};
