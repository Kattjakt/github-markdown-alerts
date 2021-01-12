import React, {
  ElementType,
  FC,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import parse from "html-react-parser";
import { Context, Alert, variants, MIN_WIDTH, Variant } from "./context";
import styled, { css } from "styled-components";
import ReactDOMServer from "react-dom/server";
import ResizeObserver from "resize-observer-polyfill";

export const createStyle = (alert: Alert) =>
  `
.container {
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji;

  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;

  color: ${alert.colors.text};
}
.container::before {
  content: "";

  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 0.325rem;
  background-color: ${alert.colors.background};
}

.icon {
  font-size: 2em;
  margin: 0 0.4em 0 0.5em;
  transform: translateY(-0.06em);
}

.code {
  display: inline-block;

  font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
  font-size: 0.85em;
  font-weight: 600;

  margin-bottom: -0.2em;
  padding-top: 0.1em;
  padding-bottom: 0.1em;
  padding-right: 0.4em;
  padding-left: 0.4em;

  border-radius: 0.2em;
  background: ${alert.colors.background};

  mix-blend-mode: difference;
  opacity: 0.9;
  transform: translateY(-0.06em);
}

.text {
  font-size: 1em;
  margin-right: 0.75em;
  line-height: 1.3;
}

.icon,
.text {
  mix-blend-mode: exclusion;
}

@media (max-width: 768px) {
  .text {
    font-size: 0.9em;
  }

  .icon {
    font-size: 1.85em;
    margin-left: 0.5em;
    margin-right: 0.4em;
  }
}

@media (max-width: 544px) {
  .text {
    font-size: 0.8em;
  }

  .icon {
    font-size: 1.5em;
    margin-left: 0.5em;
    margin-right: 0.35em;
  }
}

@media (max-width: 350px) {
  .text {
    font-size: 0.8em;
    margin-left: 1em;
  }

  .icon {
    display: none;
  }
}
`.trim();

export const createBannerTemplate = (
  height?: "100%" | number,
  style = "",
  icon = "",
  text = ""
) => {
  let formattedHeight: string | number = height || "0px";

  if (typeof formattedHeight === "number") {
    formattedHeight = `${height}px`;
  }

  return `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" width="100%" height="${formattedHeight}">
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml" class="root">
      <style>
${style}
      </style>

      <div class="container">
        <span class="icon">${icon}</span>
        <p class="text">${text}</p>
      </div>
    </div>
  </foreignObject>
</svg>
  `;
};

const updateIframeContent = (document: Document, template: string) => {
  const headElement = document.querySelector("head");
  const bodyElement = document.querySelector("body");

  if (!headElement || !bodyElement) {
    return;
  }

  if (!headElement.innerHTML) {
    headElement.innerHTML = `
      <style>
        body {
          margin: 0;
          overflow-y: hidden;
        }

        ::selection {
          background: rgba(0, 0, 0, 0.1);
          color: inherit;
        }

        [contenteditable="true"]:focus {
          outline: none;
        }
      </style>
    `;
  }

  bodyElement.innerHTML = template;
};

const IFrame = styled.iframe`
  width: 100%;
  border: none;
  position: absolute;
  top: 0;
`;

interface BannerPreviewProps {
  innerRef: React.RefObject<HTMLIFrameElement>;
}

const useMutateSvg = (
  svg: SVGSVGElement | null,
  alert: { text: string; variant: Variant }
) => {
  // Update variant colors
  useEffect(() => {
    if (svg) {
      const element = svg.querySelector("svg style");
      const variant = variants[alert.variant];

      if (element) {
        element.innerHTML = createStyle(variant);
      }
    }
  }, [svg, alert.variant]);

  // Update variant icon
  useEffect(() => {
    if (svg) {
      const element = svg.querySelector("svg .icon");
      const variant = variants[alert.variant];

      if (element) {
        element.textContent = variant.icon;
      }
    }
  }, [svg, alert.variant]);

  // Update variant text
  useLayoutEffect(() => {
    if (svg) {
      const element = svg.querySelector("svg .text");

      if (element) {
        if (element.innerHTML !== alert.text) {
          element.innerHTML = alert.text;
        }
      }
    }
  }, [svg, alert.text]);
};

export const BannerPreview: FC<BannerPreviewProps> = (props) => {
  const context = useContext(Context);
  const [document, setDocument] = useState<Document | null>(null);

  const ref = useRef<HTMLIFrameElement>(null);
  const [svg, setSvg] = useState<SVGSVGElement | null>(null);

  useMutateSvg(svg, {
    text: context.text,
    variant: context.variant,
  });

  useEffect(() => {
    const node = ref.current;
    const iframe = node?.querySelector("iframe");

    setDocument(iframe?.contentDocument || null);
  }, []);

  useEffect(() => {
    if (!document) {
      return;
    }

    const template = createBannerTemplate();

    updateIframeContent(document, template);

    setSvg(document.querySelector("svg"));
  }, [document, context.actions]);

  useEffect(() => {
    if (!svg) {
      return;
    }

    const text = svg.querySelector<HTMLParagraphElement>(".text");

    if (!text) {
      return;
    }

    text.contentEditable = "true";

    const mutationObserver = new MutationObserver(() => {
      context.actions.setText(text?.innerHTML || "");
    });

    const observerConfig: MutationObserverInit = {
      subtree: true,
      childList: true,
      characterData: true,
    };

    mutationObserver.observe(text, observerConfig);

    return () => {
      mutationObserver.disconnect();
    };
  }, [svg, context.actions]);

  // Update height
  useEffect(() => {
    if (svg) {
      svg.setAttribute("height", `${context.height}px`);
    }
  }, [svg, context.height]);

  return (
    <div ref={ref}>
      <IFrame
        id="banner"
        title="Banner"
        src="about:blank"
        scrolling="no"
        frameBorder="0"
        ref={props.innerRef}
        style={{ height: context.height }}
      />
    </div>
  );
};

export const useHeight = (banner: { text: string; variant: Variant }) => {
  const [height, setHeight] = useState(0);

  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  const [svg, setSvg] = useState<SVGSVGElement | null>(null);

  useMutateSvg(svg, banner);

  useEffect(() => {
    const element = document.createElement("iframe");

    element.style.position = "fixed";
    element.style.transform = "translate(-100vw)";
    element.style.border = "none";

    document.body.appendChild(element);

    setIframe(element);

    if (!element.contentDocument) {
      return;
    }

    const template = createBannerTemplate("100%");

    updateIframeContent(element.contentDocument, template);

    console.log(element.contentDocument?.readyState);

    const update = () => {
      const document = element.contentDocument;

      if (document && document.readyState === "complete") {
        setSvg(document.querySelector("svg"));
      }
    };

    element.contentDocument.addEventListener("readystatechange", update);

    return () => {
      element.contentDocument?.removeEventListener("readystatechange", update);
      document.body.removeChild(element);
    };
  }, []);

  useLayoutEffect(() => {
    if (iframe && svg) {
      const content = svg.querySelector(".root");

      iframe.style.width = `${MIN_WIDTH}px`;

      const max = content?.clientHeight || 0;

      setHeight(max);
    }
  }, [svg, iframe, banner]);

  return height;
};
