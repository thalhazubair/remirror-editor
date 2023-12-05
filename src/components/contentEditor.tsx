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
    const { getJSON } = useHelpers()

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
    
        const parsedData = JSON.parse(data);

        setContent(parsedData);

    }, [data, setContent]);

    return(
      <button
        onMouseDown={(event) => event.preventDefault()}
        onClick={handleClick}
      >
        Preload
      </button>
    )
  }

  return (
    <div>
      <Remirror manager={manager} state={state} onChange={onChange} autoFocus>
        <EditorComponent />
        <LoadButton />
        <SaveButton />
        <PostLoad/>
      </Remirror>
    </div>
  );
}
