"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Options } from "react-markdown";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

const PREVIEW_CHAR_LIMIT = 300;

interface MarkdownProps {
  content: string;
  className?: string;
  showLineNumbers?: boolean;
  allowCopy?: boolean;
}

export default function Markdown({
  content,
  className = "",
  allowCopy = true,
}: MarkdownProps) {
  const [expanded, setExpanded] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const isLong = content.length > PREVIEW_CHAR_LIMIT;
  const previewContent = isLong
    ? `${content.slice(0, PREVIEW_CHAR_LIMIT)}...`
    : content;

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const components: Options["components"] = {
    // Enhanced link component
    a: ({ href, children, ...props }) => {
      const isExternal = href?.startsWith("http");
      const linkProps = isExternal
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {};

      return (
        <Link
          {...linkProps}
          href={href || "#"}
          className="text-blue-400 underline decoration-blue-400/50 transition-colors duration-200 hover:text-blue-300 hover:decoration-blue-300"
          {...props}
        >
          {children}
        </Link>
      );
    },

    // Enhanced code block component
    pre: ({ children, ...props }) => {
      const codeElement = children as any;
      const codeContent = codeElement?.props?.children || "";
      const language =
        codeElement?.props?.className?.replace("language-", "") || "text";
      const codeId = `code-${Math.random().toString(36).substr(2, 9)}`;

      return (
        <div className="group relative my-4">
          <div className="flex items-center justify-between rounded-t-lg border-gray-700 border-b bg-gray-800 px-4 py-2">
            <span className="font-mono text-gray-400 text-sm uppercase tracking-wide">
              {language}
            </span>
            {allowCopy && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(codeContent, codeId)}
                className="h-8 w-8 p-0 text-gray-400 opacity-0 transition-opacity duration-200 hover:text-white group-hover:opacity-100"
              >
                {copiedCode === codeId ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          <pre
            className="overflow-x-auto rounded-b-lg border border-gray-700 border-t-0 bg-gray-900 p-4 text-sm leading-relaxed"
            {...props}
          >
            {children}
          </pre>
        </div>
      );
    },

    // Enhanced inline code
    code: ({ children, className, ...props }) => {
      const isInline = !className;

      if (isInline) {
        return (
          <code
            className="rounded border border-gray-700 bg-gray-800 px-2 py-1 font-mono text-gray-200 text-sm"
            {...props}
          >
            {children}
          </code>
        );
      }

      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },

    // Enhanced headings
    h1: ({ children, ...props }) => (
      <h1
        className="mt-8 mb-4 border-gray-700 border-b pb-2 font-bold text-3xl text-white"
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        className="mt-6 mb-3 border-gray-800 border-b pb-1 font-semibold text-2xl text-white"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="mt-4 mb-2 font-semibold text-white text-xl" {...props}>
        {children}
      </h3>
    ),

    // Enhanced lists
    ul: ({ children, ...props }) => (
      <ul
        className="my-3 ml-4 list-inside list-disc space-y-1 text-gray-300"
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol
        className="my-3 ml-4 list-inside list-decimal space-y-1 text-gray-300"
        {...props}
      >
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="leading-relaxed" {...props}>
        {children}
      </li>
    ),

    // Enhanced blockquote
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="my-4 rounded-r-lg border-blue-500 border-l-4 bg-gray-800/50 py-2 pl-4 text-gray-300 italic"
        {...props}
      >
        {children}
      </blockquote>
    ),

    // Enhanced table
    table: ({ children, ...props }) => (
      <div className="my-4 overflow-x-auto">
        <table
          className="min-w-full overflow-hidden rounded-lg border border-gray-700"
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }) => (
      <thead className="bg-gray-800" {...props}>
        {children}
      </thead>
    ),
    th: ({ children, ...props }) => (
      <th
        className="border-gray-700 border-b px-4 py-2 text-left font-semibold text-white"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td
        className="border-gray-800 border-b px-4 py-2 text-gray-300"
        {...props}
      >
        {children}
      </td>
    ),

    // Enhanced paragraph
    p: ({ children, ...props }) => (
      <p className="mb-4 text-gray-300 leading-relaxed" {...props}>
        {children}
      </p>
    ),

    // Enhanced horizontal rule
    hr: ({ ...props }) => <hr className="my-6 border-gray-700" {...props} />,
  };

  return (
    <div className={`group relative w-full ${className}`}>
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
          components={components}
        >
          {expanded || !isLong ? content : previewContent}
        </ReactMarkdown>
      </div>

      {/* Gradient overlay and Read more button - only show when content is truncated */}
      {isLong && !expanded && (
        <div className="absolute right-0 bottom-0 left-0 flex h-20 items-end justify-center bg-gradient-to-t from-black via-black/80 to-transparent pb-4">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="font-medium text-white opacity-0 transition-opacity duration-300 hover:text-gray-300 group-hover:opacity-100"
          >
            Đọc thêm
          </button>
        </div>
      )}

      {/* Simple collapse button for expanded content - only on hover, no permanent gradient */}
      {expanded && isLong && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="font-medium text-gray-400 opacity-0 transition-opacity duration-300 hover:text-white group-hover:opacity-100"
          >
            Rút gọn
          </button>
        </div>
      )}
    </div>
  );
}
