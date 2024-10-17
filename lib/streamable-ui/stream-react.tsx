import RenderResult from "next/dist/server/render-result";
import { ReactNode } from "react";
import { createStreamableUI } from "@/lib/streamable-ui/create-streamable-ui";

type Streamable$1 = ReactNode | Promise<ReactNode>;
type Renderer$1 = () =>
  | Streamable$1
  | Generator<Streamable$1, Streamable$1, void>
  | AsyncGenerator<Streamable$1, Streamable$1, void>;

const streamReact = async (generate: Renderer$1): Promise<RenderResult> => {
  // Initialize the UI stream with no initial value
  const ui = createStreamableUI(null);

  async function render({
    renderer,
    streamableUI,
    isLastCall = false,
  }: {
    renderer: undefined | Renderer$1;
    streamableUI: ReturnType<typeof createStreamableUI>;
    isLastCall?: boolean;
  }) {
    if (!renderer) return;

    const rendererResult = renderer();

    if (isAsyncGenerator(rendererResult) || isGenerator(rendererResult)) {
      while (true) {
        const { done, value } = await rendererResult.next();
        const node = await value;

        if (isLastCall && done) {
          streamableUI.done(node);
        } else {
          streamableUI.update(node);
        }

        if (done) break;
      }
    } else {
      const node = await rendererResult;

      if (isLastCall) {
        streamableUI.done(node);
      } else {
        streamableUI.update(node);
      }
    }
  }

  try {
    // Render the initial call
    await render({
      renderer: generate,
      streamableUI: ui,
      isLastCall: true,
    });
  } catch (error) {
    ui.error(error);
  }

  return {
    // @ts-expect-error just use value anyways
    value: ui.value,
  };
};

function isAsyncGenerator(value: any): value is AsyncGenerator {
  return value && typeof value[Symbol.asyncIterator] === "function";
}

function isGenerator(value: any): value is Generator {
  return value && typeof value[Symbol.iterator] === "function";
}

export default streamReact;
