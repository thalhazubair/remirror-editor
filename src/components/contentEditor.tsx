import {
  EditorComponent,
  Remirror,
  ReactExtensions,
  UseRemirrorReturn,
  useRemirrorContext,
  useHelpers,
} from "@remirror/react";
import { AnyExtension, RemirrorEventListener } from "remirror";
import { useCallback, useState } from "react";
import { SAMPLE_DOC } from "./editor";

export function ContentEditor({
  editor: { manager, state },
  onChange,
}: {
  editor: UseRemirrorReturn<ReactExtensions<AnyExtension>>;
  onChange: RemirrorEventListener<AnyExtension>;
}) {
  const [data, setData] = useState("");

  function LoadButton() {
    const { setContent } = useRemirrorContext();
    const handleClick = useCallback(() => setContent(SAMPLE_DOC), [setContent]);

    return (
      <>
        <button
          onMouseDown={(event) => event.preventDefault()}
          onClick={handleClick}
        >
          Load
        </button>
      </>
    );
  }

  function SaveButton() {
    const { getJSON } = useHelpers();

    const handleClick = useCallback(() => {
      setData(JSON.stringify(getJSON()));
    }, [getJSON]);

    return (
      <button
        onMouseDown={(event) => event.preventDefault()}
        onClick={handleClick}
      >
        Save
      </button>
    );
  }

  function PostLoad() {
    const { setContent } = useRemirrorContext();
    const handleClick = useCallback(() => {
      if (data.length) {
        const parsedData = JSON.parse(data);

        setContent(parsedData);
      } else {
        alert("no saved data found");
      }
    }, [data, setContent]);

    return (
      <button
        onMouseDown={(event) => event.preventDefault()}
        onClick={handleClick}
      >
        Preload
      </button>
    );
  }

  function Replace() {
    const { getJSON } = useHelpers();
    const { setContent } = useRemirrorContext();

    const handleClick = useCallback(() => {
      const currentContent = getJSON();

      const updatedContent = modifyContent(currentContent);
      setContent(updatedContent);
    }, [setContent]);

    const modifyContent = (content: object) => {
      const modifiedContent = modifyTextNode(content, "hamsa", "koya");

      return modifiedContent;
    };

    const modifyTextNode = (node: any, search: string, replace: string) => {
      if (node.type === "text") {
        const newText = node.text.replace(new RegExp(search, "gi"), replace);
        return { ...node, text: newText };
      }

      if (node.content) {
        return {
          ...node,
          content: node.content.map((child: object) =>
            modifyTextNode(child, search, replace)
          ),
        };
      }

      return node;
    };

    return (
      <button
        onMouseDown={(event) => event.preventDefault()}
        onClick={handleClick}
      >
        Replace
      </button>
    );
  }

  return (
    <div>
      <Remirror manager={manager} state={state} onChange={onChange} autoFocus>
        <EditorComponent />
        <LoadButton />
        <SaveButton />
        <PostLoad />
        <Replace />
      </Remirror>
    </div>
  );
}
