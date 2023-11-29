import { EditorComponent, Remirror, ReactExtensions, UseRemirrorReturn } from "@remirror/react";
import { AnyExtension, RemirrorEventListener } from "remirror";

export function ContentEditor({
  editor: { manager, state },
  onChange,
}: {
  editor: UseRemirrorReturn<ReactExtensions<AnyExtension>>;
  onChange: RemirrorEventListener<AnyExtension>;
}) {
  return (
    <div>
      <Remirror
        manager={manager}
        state={state}
        onChange={onChange}
        autoFocus
      >
        <EditorComponent/>
      </Remirror>
    </div>
  );
}
