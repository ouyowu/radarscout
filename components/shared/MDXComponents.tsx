import Link from 'next/link';
import { AnchorHTMLAttributes, HTMLAttributes, ImgHTMLAttributes } from 'react';

// Custom components for MDX rendering
export const MDXComponents = {
  // Headings with auto-generated IDs
  h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-4xl font-black text-white mb-6 mt-8" {...props} />
  ),
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-3xl font-bold text-white mb-4 mt-8" {...props} />
  ),
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-2xl font-bold text-white mb-3 mt-6" {...props} />
  ),
  h4: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="text-xl font-semibold text-white mb-2 mt-4" {...props} />
  ),
  
  // Paragraphs
  p: (props: HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-slate-300 leading-relaxed mb-4" {...props} />
  ),
  
  // Links
  a: ({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = href?.startsWith('http');
    const isAnchor = href?.startsWith('#');
    
    if (isAnchor) {
      return (
        <a
          href={href}
          className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/30 hover:decoration-cyan-400 transition-colors"
          {...props}
        />
      );
    }
    
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/30 hover:decoration-cyan-400 transition-colors"
          {...props}
        />
      );
    }
    
    return (
      <Link
        href={href || '#'}
        className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/30 hover:decoration-cyan-400 transition-colors"
        {...props}
      />
    );
  },
  
  // Lists
  ul: (props: HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-none space-y-2 mb-4 ml-0" {...props} />
  ),
  ol: (props: HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside space-y-2 mb-4 ml-4 text-slate-300" {...props} />
  ),
  li: (props: HTMLAttributes<HTMLLIElement>) => (
    <li className="text-slate-300 flex items-start gap-2">
      <span className="text-cyan-400 flex-shrink-0 mt-1">•</span>
      <span className="flex-1">{props.children}</span>
    </li>
  ),
  
  // Blockquote
  blockquote: (props: HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote 
      className="border-l-4 border-cyan-500 bg-slate-900/50 pl-6 py-4 my-6 italic text-slate-300"
      {...props}
    />
  ),
  
  // Code blocks
  code: ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
    const isInline = !className;
    
    if (isInline) {
      return (
        <code
          className="bg-slate-800 text-cyan-400 px-1.5 py-0.5 rounded text-sm font-mono"
          {...props}
        />
      );
    }
    
    return (
      <code
        className="block bg-slate-900 text-slate-300 p-4 rounded-lg overflow-x-auto text-sm font-mono my-4"
        {...props}
      />
    );
  },
  
  pre: (props: HTMLAttributes<HTMLPreElement>) => (
    <pre className="bg-slate-900 rounded-lg overflow-hidden my-6" {...props} />
  ),
  
  // Tables
  table: (props: HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse" {...props} />
    </div>
  ),
  thead: (props: HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-slate-800" {...props} />
  ),
  tbody: (props: HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className="bg-slate-900/50" {...props} />
  ),
  tr: (props: HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="border-b border-slate-700" {...props} />
  ),
  th: (props: HTMLAttributes<HTMLTableCellElement>) => (
    <th className="px-4 py-3 text-left text-sm font-semibold text-white" {...props} />
  ),
  td: (props: HTMLAttributes<HTMLTableCellElement>) => (
    <td className="px-4 py-3 text-sm text-slate-300" {...props} />
  ),
  
  // Horizontal rule
  hr: () => (
    <hr className="border-slate-700 my-8" />
  ),

  // Images
  img: ({ src, alt = '', ...props }: ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="w-full h-auto rounded-xl border border-slate-800 my-8"
      {...props}
    />
  ),
  
  // Strong and emphasis
  strong: (props: HTMLAttributes<HTMLElement>) => (
    <strong className="font-bold text-white" {...props} />
  ),
  em: (props: HTMLAttributes<HTMLElement>) => (
    <em className="italic text-slate-200" {...props} />
  ),
};
