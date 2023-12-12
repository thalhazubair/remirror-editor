import {
  EditorComponent,
  FloatingWrapper,
  MentionAtomNodeAttributes,
  Remirror,
  useMentionAtom,
  ReactExtensions,
  UseRemirrorReturn,
  useRemirrorContext,
  useHelpers,
} from "@remirror/react";
import { AnyExtension, RemirrorEventListener } from "remirror";
import { useCallback, useState, useEffect } from "react";
import { SAMPLE_DOC } from "./editor";
import { cx } from "@remirror/core";
import styles from "@/style";

const ALL_USERS = [
  { id: "Thalha", label: "Thalha" },
  { id: "Hamsa", label: "Hamsa" },
  { id: "Jhon", label: "Jhon" },
  { id: "Koya", label: "Koya" },
  { id: "Doe", label: "Doe" },
];

const MentionSuggestor: React.FC = () => {
  const [options, setOptions] = useState<MentionAtomNodeAttributes[]>([]);
  const { state, getMenuProps, getItemProps, indexIsHovered, indexIsSelected } =
    useMentionAtom({
      items: options,
    });

  useEffect(() => {
    if (!state) {
      return;
    }

    const searchTerm = state.query.full.toLowerCase();

    const filteredOptions = ALL_USERS.filter((user) =>
      user.label.toLowerCase().includes(searchTerm)
    )
      .sort()
      .slice(0, 5);

    setOptions(filteredOptions);
  }, [state]);

  const enabled = Boolean(state);

  return (
    <FloatingWrapper
      positioner="cursor"
      enabled={enabled}
      placement="bottom-start"
    >
      <div {...getMenuProps()} className="suggestions">
        {enabled &&
          options.map((user, index) => {
            const isHighlighted = indexIsSelected(index);
            const isHovered = indexIsHovered(index);

            return (
              <div
                key={user.id}
                className={cx(
                  "suggestion",
                  isHighlighted && "highlighted",
                  isHovered && "hovered"
                )}
                {...getItemProps({
                  item: user,
                  index,
                })}
              >
                {user.label}
              </div>
            );
          })}
      </div>
    </FloatingWrapper>
  );
};

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
      <style>{styles}</style>
      <Remirror manager={manager} state={state} onChange={onChange} autoFocus>
        <EditorComponent />
        <MentionSuggestor />
        <LoadButton />
        <SaveButton />
        <PostLoad />
        <Replace />
      </Remirror>
    </div>
  );
}
