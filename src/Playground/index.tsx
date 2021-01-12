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
import { Controls } from "./Controls";
import { Context, MIN_WIDTH } from "./context";
import { BannerPreview, createBannerTemplate, useHeight } from "./hooks";
import ResizeObserver from "resize-observer-polyfill";
import { HeightIndicator, WidthIndicator } from "./Measure";
import { Source } from "./Source";

const RowContainer = styled.div`
  box-sizing: content-box;

  display: flex;
  flex-direction: column;
  /* align-items: center; */
  /* justify-content: center; */

  margin: 0 auto;
  margin-top: 5vmin;

  /* border-left: 1px dashed var(--subtle-border-color); */

  display: grid;
  grid-auto-flow: row;
  justify-content: start;
  grid-gap: 3rem;
`;

const StripeAnimation = keyframes`
  0% {
    background-position-x: 0;
  }

  100% {
    background-position-x: 28px;
  }
`;

const AreaIndicator = styled.div<{ anchor: number }>`
  position: absolute;
  top: ${(props) => `${props.anchor}px`};
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  justify-content: center;

  mix-blend-mode: difference;

  --background-color-1: #ffffff05;
  --background-color-2: #ffffff0d;

  background: repeating-linear-gradient(
    45deg,
    var(--background-color-1),
    var(--background-color-1) 10px,
    var(--background-color-2) 10px,
    var(--background-color-2) 20px
  );

  background-size: 28px;
  animation: ${StripeAnimation} 5s linear infinite;
  will-change: background-position;

  /* display: none !important; */
  /* background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cg fill='%23dc21f2' fill-opacity='0.21'%3E%3Cpath fill-rule='evenodd' d='M0 0h4v4H0V0zm4 4h4v4H4V4z'/%3E%3C/g%3E%3C/svg%3E"); */
  /* opacity: 0.75; */
`;

const Resizable = styled.div<{ minWidth: number }>`
  width: 600px;
  min-width: ${(props) => `${props.minWidth}px`};

  overflow: auto visible;
  resize: horizontal;
  position: relative;
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  position: relative;
`;

const Measurer: React.FC = (props) => {
  const context = useContext(Context);

  const bannerRef = useRef<HTMLIFrameElement>(null);

  const [rect, setRect] = useState<DOMRect | null>(null);
  const [root, setRoot] = useState<Element | null>(null);

  useLayoutEffect(() => {
    setRect(null);
    setRoot(null);

    const iframe = bannerRef.current;
    const document = iframe?.contentDocument;

    if (!document) {
      return;
    }

    setRoot(document.querySelector(".root"));

    const mutationObserver = new MutationObserver(() => {
      setRoot(document.querySelector(".root"));
    });

    const observerConfig: MutationObserverInit = {
      subtree: true,
      childList: true,
      characterData: true,
    };

    mutationObserver.observe(document.body, observerConfig);

    return () => {
      mutationObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!root) {
      return;
    }

    const resizeObserver = new ResizeObserver(
      (entries: ResizeObserverEntry[]) => {
        for (const entry of entries) {
          if (entry.target.className !== "root") {
            continue;
          }

          setRect(entry.contentRect as DOMRect);
        }
      }
    );

    setRect(root.getBoundingClientRect());

    resizeObserver.observe(root);

    return () => {
      resizeObserver.disconnect();
    };
  }, [root]);

  const contentHeight = +context.height.toFixed(0) || 0;
  const contentWidth = +(rect?.width.toFixed(0) || 0);

  return (
    <div style={{ position: "relative" }}>
      <HeightIndicator height={contentHeight}>
        {contentHeight}px
      </HeightIndicator>

      <Resizable minWidth={MIN_WIDTH}>
        <WidthIndicator width={contentWidth}>{contentWidth}px</WidthIndicator>

        <Content style={{ height: context.height }}>
          <AreaIndicator anchor={rect?.height || 0} />
          <BannerPreview innerRef={bannerRef} />
        </Content>
      </Resizable>
    </div>
  );
};

const Root = styled.div`
  padding: 0 32px;
  padding-left: 128px;
`;

const Section = styled.div`
  border-left: 1px dotted var(--subtle-border-color);
  padding-top: 1vh;
  max-width: 600px;
`;

const SectionTitle = styled.h3<{ index: React.ReactText }>`
  position: relative;

  margin: 0;
  margin-bottom: 1rem;
  color: var(--heading-color-primary);

  &:after {
    content: "";
    position: absolute;

    top: 0;
    left: -3.5rem;
    right: 0;
    bottom: 0;
    border-top: 1px dotted var(--subtle-border-color);
    border-bottom: 1px dotted var(--subtle-border-color);
  }

  &:before {
    content: ${(props) => `"${props.index}. "`};

    display: inline-block;
    width: 2rem;
    margin-left: -2rem;

    font-size: 1.2rem;
    font-weight: normal;

    opacity: 0.2;
  }
`;

const MarkdownExample = styled.pre`
  font-size: 10px;
  background-color: var(--subtle-background-color);
  opacity: 0.65;
  padding: 8px 12px;
  user-select: all;
`;

const markdownExampleContent = `
<p align="center">
  <img width="100%" src="https://example.com/alert.svg">
</p>
`.trim();

export const Playground: React.FC = (props) => {
  return (
    <Root>
      <RowContainer>
        <Section>
          <SectionTitle index={1}>Configure</SectionTitle>
          <Controls />
          <Measurer />
        </Section>

        <Section>
          <SectionTitle index={2}>Copy source</SectionTitle>
          <Source />
        </Section>

        <Section>
          <SectionTitle index={3}>Upload image</SectionTitle>

          <p>
            You can use any image hosting provider you'd like. You may also
            create a new <a href="https://gist.github.com/new">GitHub Gist</a>{" "}
            with the filename ending in <code>.svg</code>, and then copying the
            raw link.
          </p>
        </Section>

        <Section>
          <SectionTitle index={4}>Add to markdown</SectionTitle>

          <MarkdownExample>{markdownExampleContent}</MarkdownExample>
        </Section>
      </RowContainer>
    </Root>
  );
};
