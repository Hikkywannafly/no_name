import { useState } from "react";
import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
// markdown plugins
import rehypeRaw from "rehype-raw";

import Link from "next/link";
import type { Options } from "react-markdown";

const PREVIEW_CHAR_LIMIT = 300;

export default function Markdown({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false);

  const isLong = content.length > PREVIEW_CHAR_LIMIT;
  const previewContent = isLong
    ? `${content.slice(0, PREVIEW_CHAR_LIMIT)}...`
    : content;

  return (
    <div className="group relative w-full [&_pre]:whitespace-pre-wrap [&_pre]:break-words">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={components}
      >
        {expanded || !isLong ? content : previewContent}
      </ReactMarkdown>
      {isLong && !expanded && (
        <button
          type="button"
          className="absolute bottom-0 h-12 w-full bg-gradient-to-t from-black/95 via-black/65 to-transparent text-center opacity-0 transition duration-300 group-hover:opacity-100"
          onClick={() => setExpanded(true)}
        >
          Đọc thêm
        </button>
      )}
      {expanded && (
        <button
          type="button"
          className="absolute bottom-0 h-12 w-full bg-gradient-to-t from-black/95 via-black/65 to-transparent text-center opacity-0 transition duration-300 group-hover:opacity-100"
          onClick={() => setExpanded(false)}
        >
          Rút gọn
        </button>
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
