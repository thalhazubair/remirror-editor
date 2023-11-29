import { ContentEditor } from '../components/contentEditor'
import { useContentEditor } from '../ContentEditor/useContentEditor'

const initialValue = `Text editor demo`

export default function Editor() {
  const { editor, onChange, content, setContent } = useContentEditor(initialValue);
  
  return (
    <div className="container">
      <h1>text editor</h1>

      <div>
        <button onClick={() => setContent(initialValue)}>Reset</button>
      </div>
      <div className="content">
        <ContentEditor editor={editor} onChange={onChange} />

        <pre className="markdown-content">{content}</pre>
      </div>
    </div>
  )
}