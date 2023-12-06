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
    <div className="container">
      <h1
        style={{
          fontFamily: "sans-serif"
        }}
      >
        Text Editor
      </h1>

      <div>
        <button onClick={() => setContent("")}>Reset</button>
      </div>
      <div className="content">
        <ContentEditor editor={editor} onChange={onChange} />

        <pre className="markdown-content">{content}</pre>
      </div>
    </div>
  );
}
