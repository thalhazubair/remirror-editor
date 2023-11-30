import { EditorComponent, Remirror, ReactExtensions, UseRemirrorReturn, useRemirrorContext } from "@remirror/react";
import { AnyExtension, RemirrorEventListener } from "remirror";
import { useCallback } from "react";
import { SAMPLE_DOC } from "./editor";


export function ContentEditor({
  editor: { manager, state },
  onChange,
}: {
  editor: UseRemirrorReturn<ReactExtensions<AnyExtension>>;
  onChange: RemirrorEventListener<AnyExtension>;
}) {

  function LoadButton() {
    const { setContent } = useRemirrorContext();
    const handleClick = useCallback(() => setContent(SAMPLE_DOC), [setContent]);
  
    return (
      <button onMouseDown={(event) => event.preventDefault()} onClick={handleClick}>
        Load
      </button>
    );
  }  

  return (
    <div>
      <Remirror
        manager={manager}
        state={state}
        onChange={onChange}
        autoFocus
      >
        <EditorComponent/>
        <LoadButton/>
      </Remirror>
    </div>
  );
}
