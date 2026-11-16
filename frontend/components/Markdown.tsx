import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Render markdown (with tables) using the site's prose styling. */
export default function Markdown({ text }: { text: string }) {
  return (
    <div className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </div>
  );
}
