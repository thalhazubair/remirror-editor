import remirrorExtensions from "./extensions";
import { ReactExtensions, useRemirror, UseRemirrorReturn } from "@remirror/react";
import { useCallback, useState } from "react";
import { AnyExtension, RemirrorEventListener, RemirrorEventListenerProps } from "remirror";

export interface UseContentEditorReturnType {
  editor: UseRemirrorReturn<ReactExtensions<AnyExtension>>;
  onChange: RemirrorEventListener<AnyExtension>;
  content: string;
  setContent: (content: string) => void;
}

export function useContentEditor(
  value: string,
  args?: {
    placeholder?: string;
  }
): UseContentEditorReturnType {
  const [content, setMarkdownContent] = useState(value);

  const extensions = remirrorExtensions(args?.placeholder);

  const editor = useRemirror({
    extensions,
    stringHandler: "markdown",
    content: value,
    selection: "start",
  });

  const { onChange, manager } = editor;

  const onEditorChange = useCallback(
    (
      parameter: RemirrorEventListenerProps<
        ReactExtensions<ReturnType<typeof extensions>[number]>
      >,
    ) => {
      const markdownContent = parameter.helpers.getMarkdown(parameter.state);
      setMarkdownContent(markdownContent);
      onChange(parameter);
    },
    [onChange],
  );

  const setContent = useCallback(
    (value: string) => {
      manager.view.updateState(
        manager.createState({
          content: value,
          selection: "end",
          stringHandler: "markdown",
        }),
      );
      setMarkdownContent(value);
    },
    [manager],
  );

  return {
    editor,
    onChange: onEditorChange,
    setContent,
    content,
  };
}