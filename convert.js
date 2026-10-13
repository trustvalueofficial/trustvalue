const fs = require('fs');

const html = fs.readFileSync('brain/uiux/mysuggestion.html', 'utf8');

function htmlToJsx(htmlStr) {
  let jsx = htmlStr;
  
  // Replace HTML comments
  jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');
  
  // Replace class= with className=
  jsx = jsx.replace(/\bclass=/g, 'className=');
  
  // Replace for= with htmlFor=
  jsx = jsx.replace(/\bfor=/g, 'htmlFor=');
  
  // Replace tabindex= with tabIndex=
  jsx = jsx.replace(/\btabindex=/g, 'tabIndex=');
  
  // Replace other camelCase attrs
  jsx = jsx.replace(/\bautocomplete=/g, 'autoComplete=');
  jsx = jsx.replace(/\bautocapitalize=/g, 'autoCapitalize=');
  jsx = jsx.replace(/\bspellcheck=/g, 'spellCheck=');
  jsx = jsx.replace(/\benterkeyhint=/g, 'enterKeyHint=');
  jsx = jsx.replace(/\bcontenteditable=/g, 'contentEditable=');
  jsx = jsx.replace(/\bnovalidate\b/g, 'noValidate');
  jsx = jsx.replace(/\bviewbox=/g, 'viewBox=');
  jsx = jsx.replace(/\bstroke-width=/g, 'strokeWidth=');
  jsx = jsx.replace(/\bstroke-linecap=/g, 'strokeLinecap=');
  jsx = jsx.replace(/\bstroke-linejoin=/g, 'strokeLinejoin=');
  jsx = jsx.replace(/\bclip-path=/g, 'clipPath=');
  jsx = jsx.replace(/\bclip-rule=/g, 'clipRule=');
  jsx = jsx.replace(/\bfill-rule=/g, 'fillRule=');
  jsx = jsx.replace(/\btransform-origin=/g, 'transformOrigin=');
  jsx = jsx.replace(/\bfetchpriority=/g, 'fetchPriority=');
  jsx = jsx.replace(/\bdatetime=/g, 'dateTime=');
  
  // Correct ARIA attributes (React requires exact lowercase or kebab-case)
  jsx = jsx.replace(/\baria-autoComplete=/gi, 'aria-autocomplete=');
  
  // Self-closing input
  jsx = jsx.replace(/<input([^>]*?[^\/])>/gi, '<input$1 />');
  
  // Self-closing img
  jsx = jsx.replace(/<img([^>]*?[^\/])>/gi, '<img$1 />');
  
  // Self-closing br
  jsx = jsx.replace(/<br>/gi, '<br />');

  // Replace bulky base64 data URIs with clean public/brand assets
  jsx = jsx.replace(/<img class="descriptor" src="data:image\/[^"]+"/g, '<img class="descriptor" src="/brand/descriptor-icon.webp"');
  jsx = jsx.replace(/<img class="status__mascot" src="data:image\/[^"]+"/g, '<img class="status__mascot" src="/brand/status-mascot.webp"');
  jsx = jsx.replace(/<img class="north__mascot" src="data:image\/[^"]+"/g, '<img class="north__mascot" src="/brand/north-mascot.webp"');
  jsx = jsx.replace(/<div class="ladder__result"[^>]*>\s*<img src="data:image\/[^"]+"/g, (m) => m.replace(/src="data:image\/[^"]+"/, 'src="/brand/result-icon.webp"'));
  jsx = jsx.replace(/<div class="descriptor"[^>]*>\s*<img src="data:image\/[^"]+"/g, (m) => m.replace(/src="data:image\/[^"]+"/, 'src="/brand/descriptor-icon.webp"'));

  // Replace value on inputs without onChange with defaultValue to avoid React warning
  jsx = jsx.replace(/<input([^>]*?)\bvalue=([^>]*?)\/>/gi, (match, before, after) => {
    if (before.includes('onChange') || after.includes('onChange') || before.includes('type="button"') || before.includes('type="submit"') || before.includes('type="hidden"')) {
      return match;
    }
    return `<input${before}defaultValue=${after}/>`;
  });

  // Fix select defaultValue and remove selected from option
  jsx = jsx.replace('<select id="dec-sector" className="tv-select">', '<select id="dec-sector" className="tv-select" defaultValue="ins">');
  jsx = jsx.replace('<select id="dec-type" className="tv-select">', '<select id="dec-type" className="tv-select" defaultValue="term">');
  jsx = jsx.replace(/<option value="ins" selected>/g, '<option value="ins">');
  jsx = jsx.replace(/<option value="term" selected>/g, '<option value="term">');

  // Convert inline styles: style="..." to style={{ ... } as any}
  jsx = jsx.replace(/\bstyle="([^"]*)"/g, (match, styleStr) => {
    const rules = styleStr.split(';').filter(r => r.trim());
    const objProps = rules.map(rule => {
      const parts = rule.split(':');
      if (parts.length < 2) return '';
      let key = parts[0].trim();
      let val = parts.slice(1).join(':').trim();
      return `"${key}": "${val}"`;
    }).filter(Boolean);
    return `style={{ ${objProps.join(', ')} } as any}`;
  });
  
  return jsx;
}

const lines = html.split('\n');
const mainHtml = lines.slice(410, 1379).join('\n');
const fabHtml = lines[1431];
const toastHtml = lines[1432];
const nudgeHtml = lines[1913];

const fullBodyHtml = mainHtml + '\n' + fabHtml + '\n' + toastHtml + '\n' + nudgeHtml;
const convertedJsx = htmlToJsx(fullBodyHtml);

// Extract the scripts cleanly (without <script> or </script> tags)
let script1 = lines.slice(1437, 1913).join('\n');
script1 = script1.replace(/<\/?script[^>]*>/gi, '');

let script2 = lines.slice(1916, 2275).join('\n');
script2 = script2.replace(/<\/?script[^>]*>/gi, '');

// Extract tv-index JSON string
const tvIndexMatch = html.match(/<script type="application\/json" id="tv-index">([\s\S]*?)<\/script>/);
const tvIndexJson = tvIndexMatch ? tvIndexMatch[1].trim() : '[]';

const pageCode = `// @ts-nocheck
"use client";

import React, { useEffect } from "react";
import "./home.css";

export default function HomePage() {
  useEffect(() => {
    ${script1}
    ${script2}
  }, []);

  return (
    <>
      <script
        type="application/json"
        id="tv-index"
        dangerouslySetInnerHTML={{ __html: ${JSON.stringify(tvIndexJson)} }}
      />
      ${convertedJsx}
    </>
  );
}
`;

fs.writeFileSync('src/app/page.tsx', pageCode);
console.log('page.tsx converted with @ts-nocheck and fully optimized React 19 JSX successfully');
