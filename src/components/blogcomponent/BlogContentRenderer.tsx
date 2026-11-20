"use client";

import React from "react";

export interface HeadingItem {
  id: string;
  label: string;
}

/**
 * Helper to slugify heading text into a clean URL-safe anchor ID.
 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Ensures all <h2> tags have unique anchor IDs and scroll-margin-top classes,
 * extracting them for dynamic Table of Contents generation.
 */
export function processHtmlHeadings(rawHtml: string): {
  processedHtml: string;
  headings: HeadingItem[];
} {
  const headings: HeadingItem[] = [];
  const seenIds = new Set<string>();

  const processedHtml = rawHtml.replace(/<h2([^>]*)>(.*?)<\/h2>/gis, (fullMatch, attrs, inner) => {
    const cleanLabel = inner
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#8226;/g, "•")
      .replace(/&#10003;/g, "✓")
      .trim();

    if (!cleanLabel) return fullMatch;

    const idMatch = attrs.match(/id=["']([^"']+)["']/i);
    let id = idMatch ? idMatch[1] : `sec-${slugifyHeading(cleanLabel)}`;

    // Deduplicate IDs if multiple identical headings exist
    let uniqueId = id;
    let counter = 2;
    while (seenIds.has(uniqueId)) {
      uniqueId = `${id}-${counter}`;
      counter++;
    }
    seenIds.add(uniqueId);

    headings.push({ id: uniqueId, label: cleanLabel });

    let updatedAttrs = attrs;
    if (idMatch) {
      updatedAttrs = updatedAttrs.replace(/id=["'][^"']+["']/i, `id="${uniqueId}"`);
    } else {
      updatedAttrs += ` id="${uniqueId}"`;
    }

    // Inject scroll-mt-24 if missing
    if (!/scroll-mt-/i.test(updatedAttrs)) {
      if (/class=["']([^"']*)["']/i.test(updatedAttrs)) {
        updatedAttrs = updatedAttrs.replace(/class=["']([^"']*)["']/i, 'class="$1 scroll-mt-24"');
      } else {
        updatedAttrs += ' class="scroll-mt-24"';
      }
    }

    return `<h2${updatedAttrs}>${inner}</h2>`;
  });

  return { processedHtml, headings };
}

interface BlogContentRendererProps {
  html: string;
  className?: string;
}

/**
 * Production-Grade Dynamic Blog Content Renderer
 * Handles raw HTML tags uploaded via Excel or CMS.
 * Styles all tags and parent-child hierarchies purely using Tailwind CSS utility variants.
 */
export function BlogContentRenderer({ html, className = "" }: BlogContentRendererProps) {
  return (
    <div
      id="article-body"
      className={`tv-prose-html bg-white border border-[#DCE2EB] rounded-2xl p-5 sm:p-7 mb-6 shadow-xs
        /* Headings */
        [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:text-[#071B46] [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:tracking-tight
        [&_h2]:text-xl sm:[&_h2]:text-[22px] [&_h2]:font-extrabold [&_h2]:text-[#071B46] [&_h2]:mt-9 [&_h2]:mb-3.5 [&_h2]:tracking-tight [&_h2]:leading-snug [&_h2]:scroll-mt-24 [&_h2]:border-b [&_h2]:border-slate-100 [&_h2]:pb-2.5
        [&_h2:first-child]:mt-0
        [&_h3]:text-lg sm:[&_h3]:text-[19px] [&_h3]:font-bold [&_h3]:text-[#0C2659] [&_h3]:mt-7 [&_h3]:mb-3 [&_h3]:tracking-tight [&_h3]:leading-snug [&_h3]:scroll-mt-24
        [&_h4]:text-base [&_h4]:font-bold [&_h4]:text-slate-800 [&_h4]:mt-5 [&_h4]:mb-2
        
        /* Paragraphs & Text */
        [&_p]:text-[15px] sm:[&_p]:text-[15.5px] [&_p]:leading-[1.78] [&_p]:text-slate-700 [&_p]:mb-5 [&_p]:font-normal
        [&_strong]:font-bold [&_strong]:text-[#071B46]
        [&_b]:font-bold [&_b]:text-[#071B46]
        [&_em]:italic [&_em]:text-slate-600
        [&_i]:italic [&_i]:text-slate-600
        [&_a]:text-[#FF5A0A] [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-[#FF5A0A]/40 hover:[&_a]:decoration-[#FF5A0A] hover:[&_a]:text-[#E04800] [&_a]:transition-colors
        
        /* Lists */
        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-2 [&_ul]:text-slate-700
        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:space-y-2 [&_ol]:text-slate-700
        [&_li]:text-[15px] [&_li]:leading-[1.7] [&_li]:text-slate-700 [&_li]:pl-1
        [&_li::marker]:text-[#FF5A0A] [&_li::marker]:font-bold
        [&_li_strong]:text-[#071B46] [&_li_strong]:font-bold
        
        /* Tables */
        [&_table]:w-full [&_table]:border-collapse [&_table]:my-6 [&_table]:text-[13.5px] [&_table]:text-left [&_table]:border [&_table]:border-slate-200 [&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:shadow-xs
        [&_thead]:bg-slate-100/90 [&_thead]:border-b-2 [&_thead]:border-slate-200
        [&_th]:p-3 sm:[&_th]:p-3.5 [&_th]:font-bold [&_th]:text-[#071B46] [&_th]:uppercase [&_th]:text-[11.5px] [&_th]:tracking-wider [&_th]:border-b [&_th]:border-slate-200
        [&_tbody_tr]:border-b [&_tbody_tr]:border-slate-100 hover:[&_tbody_tr]:bg-slate-50/70 [&_tbody_tr]:transition-colors
        [&_tbody_tr:last-child]:border-b-0
        [&_td]:p-3 sm:[&_td]:p-3.5 [&_td]:text-slate-700 [&_td]:align-middle
        [&_td_strong]:text-[#071B46] [&_td_strong]:font-semibold
        
        /* Blockquotes */
        [&_blockquote]:border-l-4 [&_blockquote]:border-[#FF5A0A] [&_blockquote]:bg-orange-50/40 [&_blockquote]:rounded-r-xl [&_blockquote]:p-4 sm:[&_blockquote]:p-5 [&_blockquote]:my-6 [&_blockquote]:italic [&_blockquote]:text-slate-800 [&_blockquote]:text-[15px] [&_blockquote]:leading-relaxed
        [&_h2+blockquote]:border-l-4 [&_h2+blockquote]:border-emerald-500 [&_h2+blockquote]:bg-emerald-50/70 [&_h2+blockquote]:text-emerald-950 [&_h2+blockquote]:not-italic [&_h2+blockquote]:font-medium [&_h2+blockquote]:rounded-xl [&_h2+blockquote]:p-4.5 sm:[&_h2+blockquote]:p-5 [&_h2+blockquote]:my-5
        [&_blockquote_p]:mb-0 [&_blockquote_p]:text-inherit
        
        /* Figures & SVGs (Infographics - Borderless, Clean) */
        [&_figure]:my-8 [&_figure]:p-0 [&_figure]:bg-transparent [&_figure]:overflow-hidden [&_figure]:max-w-full [&_figure]:text-center [&_figure]:border-0
        [&_figure_svg]:w-full [&_figure_svg]:h-auto [&_figure_svg]:max-w-full [&_figure_svg]:block [&_figure_svg]:mx-auto
        [&_figcaption]:hidden
        
        /* Horizontal Rules, Codes & Pre */
        [&_hr]:my-8 [&_hr]:border-t [&_hr]:border-slate-200
        [&_code]:bg-slate-100 [&_code]:text-slate-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[13px] [&_code]:font-mono [&_code]:border [&_code]:border-slate-200
        [&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:p-4 sm:[&_pre]:p-5 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:my-6 [&_pre]:text-[13px] [&_pre]:font-mono [&_pre]:leading-relaxed
        [&_pre_code]:bg-transparent [&_pre_code]:text-inherit [&_pre_code]:p-0 [&_pre_code]:border-0
        
        /* Pure Semantic Header (EEAT Byline without classes) */
        [&>header:first-of-type]:flex [&>header:first-of-type]:flex-wrap [&>header:first-of-type]:items-center [&>header:first-of-type]:gap-2 [&>header:first-of-type]:p-3.5 [&>header:first-of-type]:bg-slate-50 [&>header:first-of-type]:border [&>header:first-of-type]:border-slate-200 [&>header:first-of-type]:rounded-xl [&>header:first-of-type]:mb-6 [&>header:first-of-type]:text-xs [&>header:first-of-type]:text-slate-600
        [&>header:first-of-type>span:first-child]:font-bold [&>header:first-of-type>span:first-child]:uppercase [&>header:first-of-type>span:first-child]:tracking-wider [&>header:first-of-type>span:first-child]:text-[#071B46] [&>header:first-of-type>span:first-child]:text-[11px] [&>header:first-of-type>span:first-child]:bg-transparent [&>header:first-of-type>span:first-child]:border-0 [&>header:first-of-type>span:first-child]:p-0
        [&>header:first-of-type>span]:inline-flex [&>header:first-of-type>span]:items-center [&>header:first-of-type>span]:px-2.5 [&>header:first-of-type>span]:py-1 [&>header:first-of-type>span]:rounded-md [&>header:first-of-type>span]:bg-white [&>header:first-of-type>span]:border [&>header:first-of-type>span]:border-slate-200 [&>header:first-of-type>span]:text-slate-800 [&>header:first-of-type>span]:font-semibold [&>header:first-of-type>span]:text-[11.5px]
        [&>header:first-of-type>span:last-child]:ml-auto [&>header:first-of-type>span:last-child]:bg-emerald-50 [&>header:first-of-type>span:last-child]:text-[#0A8754] [&>header:first-of-type>span:last-child]:border-emerald-200 [&>header:first-of-type>span:last-child]:font-bold
        
        /* Pure Semantic Section & Nav (People Also Liked Articles Carousel) */
        [&_section]:mt-10 [&_section]:p-5 sm:[&_section]:p-6 [&_section]:bg-slate-50/80 [&_section]:border [&_section]:border-slate-200 [&_section]:rounded-2xl
        [&_section>div:first-child]:flex [&_section>div:first-child]:items-center [&_section>div:first-child]:justify-between [&_section>div:first-child]:flex-wrap [&_section>div:first-child]:gap-2 [&_section>div:first-child]:mb-4
        [&_section>div:first-child>div>span]:text-[10.5px] [&_section>div:first-child>div>span]:font-bold [&_section>div:first-child>div>span]:text-[#FF5A0A] [&_section>div:first-child>div>span]:uppercase [&_section>div:first-child>div>span]:tracking-wider [&_section>div:first-child>div>span]:block [&_section>div:first-child>div>span]:mb-0.5
        [&_section>div:first-child>div>h2]:text-lg [&_section>div:first-child>div>h2]:font-extrabold [&_section>div:first-child>div>h2]:text-[#071B46] [&_section>div:first-child>div>h2]:m-0 [&_section>div:first-child>div>h2]:border-0 [&_section>div:first-child>div>h2]:p-0 [&_section>div:first-child>div>h2]:tracking-tight
        [&_section>div:first-child>span:last-child]:text-[11.5px] [&_section>div:first-child>span:last-child]:font-semibold [&_section>div:first-child>span:last-child]:text-slate-500 [&_section>div:first-child>span:last-child]:bg-slate-200/60 [&_section>div:first-child>span:last-child]:px-2.5 [&_section>div:first-child>span:last-child]:py-1 [&_section>div:first-child>span:last-child]:rounded-full
        [&_section>nav]:flex [&_section>nav]:gap-3.5 [&_section>nav]:overflow-x-auto [&_section>nav]:pb-3 [&_section>nav]:snap-x [&_section>nav]:snap-mandatory [&_section>nav]:scrollbar-thin
        [&_section>nav>article]:shrink-0 [&_section>nav>article]:w-[280px] sm:[&_section>nav>article]:w-[300px] [&_section>nav>article]:snap-start [&_section>nav>article]:bg-white [&_section>nav>article]:border [&_section>nav>article]:border-slate-200 [&_section>nav>article]:rounded-xl [&_section>nav>article]:p-4.5 [&_section>nav>article]:shadow-xs hover:[&_section>nav>article]:border-[#FF5A0A] hover:[&_section>nav>article]:shadow-md [&_section>nav>article]:transition-all [&_section>nav>article]:flex [&_section>nav>article]:flex-col [&_section>nav>article]:justify-between
        [&_section>nav>article>header]:flex [&_section>nav>article>header]:items-center [&_section>nav>article>header]:justify-between [&_section>nav>article>header]:mb-2.5 [&_section>nav>article>header]:bg-transparent [&_section>nav>article>header]:border-0 [&_section>nav>article>header]:p-0
        [&_section>nav>article>header>span:first-child]:text-[10px] [&_section>nav>article>header>span:first-child]:font-extrabold [&_section>nav>article>header>span:first-child]:uppercase [&_section>nav>article>header>span:first-child]:px-2 [&_section>nav>article>header>span:first-child]:py-0.5 [&_section>nav>article>header>span:first-child]:rounded [&_section>nav>article>header>span:first-child]:border [&_section>nav>article>header>span:first-child]:tracking-wider [&_section>nav>article>header>span:first-child]:text-[#FF5A0A] [&_section>nav>article>header>span:first-child]:bg-orange-50 [&_section>nav>article>header>span:first-child]:border-orange-200
        [&_section>nav>article>header>span:last-child]:text-[11px] [&_section>nav>article>header>span:last-child]:text-slate-400 [&_section>nav>article>header>span:last-child]:font-semibold [&_section>nav>article>header>span:last-child]:bg-transparent [&_section>nav>article>header>span:last-child]:border-0 [&_section>nav>article>header>span:last-child]:p-0
        [&_section>nav>article>h3]:text-[14px] [&_section>nav>article>h3]:font-bold [&_section>nav>article>h3]:text-[#071B46] [&_section>nav>article>h3]:leading-snug [&_section>nav>article>h3]:my-1 [&_section>nav>article>h3]:mt-0
        [&_section>nav>article>h3>a]:text-[#071B46] [&_section>nav>article>h3>a]:no-underline hover:[&_section>nav>article>h3>a]:text-[#FF5A0A]
        [&_section>nav>article>p]:text-[12px] [&_section>nav>article>p]:text-slate-500 [&_section>nav>article>p]:line-clamp-2 [&_section>nav>article>p]:my-1 [&_section>nav>article>p]:leading-relaxed
        [&_section>nav>article>footer]:mt-3.5 [&_section>nav>article>footer]:pt-2 [&_section>nav>article>footer]:border-t [&_section>nav>article>footer]:border-slate-100 [&_section>nav>article>footer]:flex [&_section>nav>article>footer]:items-center [&_section>nav>article>footer]:bg-transparent [&_section>nav>article>footer]:border-0 [&_section>nav>article>footer]:p-0
        [&_section>nav>article>footer>a]:inline-flex [&_section>nav>article>footer>a]:items-center [&_section>nav>article>footer>a]:gap-1 [&_section>nav>article>footer>a]:text-[12px] [&_section>nav>article>footer>a]:font-bold [&_section>nav>article>footer>a]:text-[#FF5A0A] [&_section>nav>article>footer>a]:no-underline hover:[&_section>nav>article>footer>a]:translate-x-0.5 [&_section>nav>article>footer>a]:transition-transform

        /* Semantic FAQ list */
        [&_h2+div>div]:border-b [&_h2+div>div]:border-slate-200 [&_h2+div>div]:py-3.5 [&_h2+div>div:last-child]:border-b-0
        [&_h2+div>div>h3]:text-sm [&_h2+div>div>h3]:font-bold [&_h2+div>div>h3]:text-[#071B46] [&_h2+div>div>h3]:m-0 [&_h2+div>div>h3]:mb-1.5
        [&_h2+div>div>p]:text-[13px] [&_h2+div>div>p]:text-slate-600 [&_h2+div>div>p]:m-0 [&_h2+div>div>p]:leading-relaxed

        /* Backward Compatibility for legacy classes */
        [&_.tv-authors-byline]:flex [&_.tv-authors-byline]:flex-wrap [&_.tv-authors-byline]:items-center [&_.tv-authors-byline]:gap-2 [&_.tv-authors-byline]:p-3.5 [&_.tv-authors-byline]:bg-slate-50 [&_.tv-authors-byline]:border [&_.tv-authors-byline]:border-slate-200 [&_.tv-authors-byline]:rounded-xl [&_.tv-authors-byline]:mb-6 [&_.tv-authors-byline]:text-xs [&_.tv-authors-byline]:text-slate-600
        [&_.tv-author-pill]:inline-flex [&_.tv-author-pill]:items-center [&_.tv-author-pill]:px-2.5 [&_.tv-author-pill]:py-1 [&_.tv-author-pill]:rounded-md [&_.tv-author-pill]:bg-white [&_.tv-author-pill]:border [&_.tv-author-pill]:border-slate-200 [&_.tv-author-pill]:text-slate-800 [&_.tv-author-pill]:font-semibold [&_.tv-author-pill]:text-[11.5px]
        [&_.tv-direct-answer-card]:p-4 sm:[&_.tv-direct-answer-card]:p-5 [&_.tv-direct-answer-card]:bg-emerald-50/80 [&_.tv-direct-answer-card]:border [&_.tv-direct-answer-card]:border-emerald-200 [&_.tv-direct-answer-card]:rounded-xl [&_.tv-direct-answer-card]:mb-6 [&_.tv-direct-answer-card]:text-emerald-950 [&_.tv-direct-answer-card]:font-medium [&_.tv-direct-answer-card]:leading-relaxed
        [&_.tv-interlinking-hub]:mt-10 [&_.tv-interlinking-hub]:p-5 sm:[&_.tv-interlinking-hub]:p-6 [&_.tv-interlinking-hub]:bg-slate-50/80 [&_.tv-interlinking-hub]:border [&_.tv-interlinking-hub]:border-slate-200 [&_.tv-interlinking-hub]:rounded-2xl
        [&_.tv-scroll-cards]:flex [&_.tv-scroll-cards]:gap-3.5 [&_.tv-scroll-cards]:overflow-x-auto [&_.tv-scroll-cards]:pb-3 [&_.tv-scroll-cards]:snap-x [&_.tv-scroll-cards]:snap-mandatory [&_.tv-scroll-cards]:scrollbar-thin
        [&_.tv-scroll-cards>div]:flex-shrink-0 [&_.tv-scroll-cards>div]:w-[280px] sm:[&_.tv-scroll-cards>div]:w-[300px] [&_.tv-scroll-cards>div]:snap-start [&_.tv-scroll-cards>div]:bg-white [&_.tv-scroll-cards>div]:border [&_.tv-scroll-cards>div]:border-slate-200 [&_.tv-scroll-cards>div]:rounded-xl [&_.tv-scroll-cards>div]:p-4 [&_.tv-scroll-cards>div]:shadow-xs hover:[&_.tv-scroll-cards>div]:border-[#FF5A0A] [&_.tv-scroll-cards>div]:transition-all [&_.tv-scroll-cards>div]:flex [&_.tv-scroll-cards>div]:flex-col [&_.tv-scroll-cards>div]:justify-between
        ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
