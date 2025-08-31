import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import "./markdown.css";

type Props = { text: string };

// strip weird citation markers like 
function normalize(s: string) {
  return s.replace(/【\d+:\d+†[^\]]+】/g, "").trim();
}

export default function MarkdownMessage({ text }: Props) {
  const md = normalize(text);
  return (
    <div className="md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          // drop "node" prop to satisfy TS
          a: ({ node, ...props }: React.ComponentPropsWithoutRef<'a'> & { node?: unknown }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
        }}
      >
        {md}
      </ReactMarkdown>
    </div>
  );
}
