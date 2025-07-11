import { useState } from "react";
import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
// markdown plugins
import rehypeRaw from "rehype-raw";

import Link from "next/link";
import type { Options } from "react-markdown";

const PREVIEW_CHAR_LIMIT = 300; // bạn có thể đổi sang số dòng nếu muốn

export default function Markdown({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false);

  const isLong = content.length > PREVIEW_CHAR_LIMIT;
  const previewContent = isLong
    ? `${content.slice(0, PREVIEW_CHAR_LIMIT)}...`
    : content;

  return (
    <div className="w-full [&_pre]:whitespace-pre-wrap [&_pre]:break-words">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={components}
      >
        {expanded || !isLong ? content : previewContent}
      </ReactMarkdown>
      {isLong && !expanded && (
        <div className="mt-2 text-center">
          <button
            type="button"
            className="font-semibold text-blue-500 hover:underline"
            onClick={() => setExpanded(true)}
          >
            Read more
          </button>
        </div>
      )}
    </div>
  );
}

type ComponentTag = {
  [key: string]: any;
};

function isExternalLink(url: string): boolean {
  return url.startsWith("http");
}

const components: Options["components"] = {
  a: ({ href, children, ...other }: ComponentTag) => {
    const linkProps = isExternalLink(href)
      ? { target: "_blank", rel: "noopener" }
      : {};

    return (
      <Link
        {...linkProps}
        href={href}
        className={"text-web-title hover:text-web-titleLighter"}
        {...other}
      >
        {children}
      </Link>
    );
  },
};
