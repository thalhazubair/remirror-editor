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
import { useForm, useFieldArray } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

interface MentionSuggestorProps {
  users: { id: string; label: string }[];
}

type FormValues = {
  fields: {
    name: string;
  }[];
};

const MentionSuggestor: React.FC<MentionSuggestorProps> = ({ users }) => {
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

    const filteredOptions = users
      .filter((user) => user.label.toLowerCase().includes(searchTerm))
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
  const [modal, setModal] = useState(false);
  const [showInputFields, setShowInputFields] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    name: "fields",
    control,
  });

  const [formData, setFormData] = useState<FormValues>({
    fields: [],
  });

  const [users, setAllUsers] = useState<{ id: string; label: string }[]>([]);

  const onSubmit = (data: FormValues) => {
    setFormData(data);
    setShowInputFields(false);
    setModal(false);

    const fieldNames = data.fields.map((field) => field.name);

    setAllUsers(() => [
      ...fieldNames.map((name) => ({
        id: name,
        label: name,
      })),
    ]);
  };

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

  function AddButton() {
    return (
      <>
        <button
          style={{
            background: "muted",
            color: "text",
            cursor: "pointer",
            marginLeft: "26px",
          }}
          onClick={() => setModal(!modal)}
        >
          Add Mentions
        </button>
      </>
    );
  }

  return (
    <div>
      <style>{styles}</style>
      <Remirror manager={manager} state={state} onChange={onChange} autoFocus>
        <EditorComponent />
        <MentionSuggestor users={users} />
        <LoadButton />
        <SaveButton />
        <PostLoad />
        <Replace />
        <AddButton />
        {modal && (
          <div
            style={{
              width: "50rem",
              height: "15rem",
              margin: "auto",
              background: "#e4e9ef",
              position: "absolute",
              top: 3,
              bottom: 3,
              left: 3,
              right: 3,
              borderRadius: "12px",
              zIndex: "999",
            }}
            onSubmit={(e) => e.preventDefault()}
          >
            {!showInputFields ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "25px 32px 16px",
                  background: "#e4e9ef",
                }}
              >
                <p
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  No Mention Options
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#515b66",
                  }}
                >
                  You have no mention options added, Start Adding now
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "white",
                }}
              >
                {fields.map((field, index) => (
                  <>
                    <div
                      key={field.id}
                      style={{
                        display: "flex",
                        gap: "20px",
                        borderBottomWidth: "1px",
                        borderBottomStyle: "solid",
                        padding: "16px 32px 24px",
                        borderColor: "#e4e9ef",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          flexGrow: "1",
                        }}
                      >
                        <h1
                          style={{
                            fontSize: "10px",
                            paddingBottom: "4px",
                          }}
                        >
                          Field Name
                        </h1>
                        <input
                          style={{
                            padding: "4px 8px",
                            width: "100%",
                            borderColor: "#e4e9ef",
                            fontSize: "16px",
                            fontWeight: 400,
                            border: "1px solid",
                          }}
                          {...register(`fields.${index}.name`, {
                            required: "Name required",
                          })}
                        ></input>
                        <ErrorMessage
                          errors={errors}
                          name={`fields.${index}.name`}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <h1
                          style={{
                            fontSize: "10px",
                            paddingBottom: "4px",
                          }}
                        >
                          Action
                        </h1>
                        <div
                          style={{
                            display: "flex",
                            border: "1px solid #e4e9ef",
                            width: "33px",
                            height: "35px",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "6px",
                          }}
                          onClick={() => {
                            remove(index);
                          }}
                        >
                          <svg
                            height="1.25rem"
                            width="1.25rem"
                            fill="currentColor"
                            data-color="red"
                          >
                            <path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path>
                            <path d="M9 10h2v8H9zm4 0h2v8h-2z"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              </div>
            )}
            <div
              style={{
                display: "flex",
                gap: 2,
                padding: "32px",
                background: "#e4e9ef",
              }}
            >
              <button
                style={{
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "14px",
                  border: "1px solid",
                  padding: "8px 16px",
                  background: "grey",
                  margin: "0px",
                  borderRadius: "6px",
                }}
                onClick={() => {
                  append({
                    name: "",
                  });
                  setShowInputFields(true);
                }}
              >
                Add Field
              </button>
            </div>
            {showInputFields && (
              <div
                style={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "end",
                  padding: "16px 32px",
                  background: "#f0ecec",
                  borderBottomLeftRadius: "12px",
                  borderBottomRightRadius: "12px",
                }}
              >
                <button
                  style={{
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "12px",
                    border: "1px solid",
                    padding: "8px 16px",
                    background: "#89a7ff",
                    margin: "0px",
                    borderRadius: "6px",
                  }}
                  onClick={() => setModal(false)}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit(onSubmit)}
                  style={{
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "12px",
                    border: "1px solid",
                    padding: "8px 16px",
                    background: "#89a7ff",
                    margin: "0px",
                    borderRadius: "6px",
                  }}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            position: "absolute",
            left: "1150px",
            width: "250px",
          }}
        >
          <div
            style={{
              borderBottom: "1px solid black",
              paddingLeft: "10px",
            }}
          >
            <p>Avaliable Mentions</p>
          </div>
          {formData.fields.map((field, index) => {
            return (
              <div key={index}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    border: "1px solid",
                  }}
                >
                  <p>{field.name}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Remirror>
    </div>
  );
}
