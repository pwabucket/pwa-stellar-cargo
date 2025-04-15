import Markdown from "react-markdown";
import { cn } from "@/lib/utils";

export default function MarkdownRender({ content }) {
  return (
    <div
      className={cn(
        "prose prose-neutral",
        "dark:prose-invert",
        "prose-a:text-blue-400 prose-a:hover:text-blue-500"
      )}
    >
      <Markdown
        components={{
          a: ({
            node, // eslint-disable-line
            ...props
          }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
