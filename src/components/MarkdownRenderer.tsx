import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

type MarkdownRendererProps = {
  content: string;
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={{
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5865F2] underline underline-offset-2 hover:text-[#7289DA]"
          >
            {children}
          </a>
        ),
        code: ({ className, children }) => {
          const isBlock = className?.includes("language-");
          if (isBlock) {
            return (
              <code className={`${className} block overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm`}>
                {children}
              </code>
            );
          }
          return (
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-zinc-100">
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="my-4 overflow-x-auto rounded-lg bg-zinc-900">{children}</pre>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
