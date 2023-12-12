import { ContentEditor } from "../components/contentEditor";
import { useContentEditor } from "../ContentEditor/useContentEditor";

export const SAMPLE_DOC = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text: "Loaded content" }],
    },
  ],
};

export default function Editor() {
  const { editor, onChange, content, setContent } =
    useContentEditor(SAMPLE_DOC);

  return (
    <div
      className="container"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1
        style={{
          fontFamily: "sans-serif",
          display: "flex",
          justifyContent: "center",
        }}
      >
        Text Editor
      </h1>

      <div>
        <button onClick={() => setContent("")}>Reset</button>
      </div>
      <div
        className="content"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ContentEditor editor={editor} onChange={onChange} />

        <div
          className="markdown-content"
          style={{
            maxWidth: "320px",
            whiteSpace: "pre-wrap",
            marginTop: "10px",
            fontFamily: "monospace",
          }}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
