'use client';

import React from 'react';

// Just return code as plain text with some basic formatting
function formatCode(code) {
  if (!code) return '';
  
  // Split by lines and preserve whitespace for code display
  const lines = code.split('\n');
  
  return lines.map((line, idx) => {
    // Add proper indentation
    const leadingSpaces = line.match(/^(\s*)/)[1];
    const content = line.trim();
    
    // Preserve indentation using non-breaking spaces or pre formatting
    return content;
  }).join('\n');
}

// Parse inline code (backticks)
function parseInlineCode(text) {
  return text.replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>');
}

// Parse a single line of bullet list
function parseListItem(line) {
  const content = line.replace(/^-\s+/, '');
  return `<li>${parseInlineCode(content)}</li>`;
}

// Code block component - renders code without syntax highlighting spans
function CodeBlock({ code, lang }) {
  return (
    <div className="md-code-block">
      <div className="md-code-header">
        <span className="md-code-lang">{lang || 'code'}</span>
        <div className="md-code-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
      <pre className="md-code-content">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Main parser function
export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let i = 0;
  let inCodeBlock = false;
  let codeBlockContent = [];
  let codeBlockLang = '';

  while (i < lines.length) {
    const line = lines[i];

    // Code block start/end
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End code block - render as plain code (no highlighting to avoid HTML issues)
        elements.push(
          <CodeBlock 
            key={`code-${i}`} 
            code={codeBlockContent.join('\n')} 
            lang={codeBlockLang} 
          />
        );
        codeBlockContent = [];
        codeBlockLang = '';
        inCodeBlock = false;
      } else {
        // Start code block
        inCodeBlock = true;
        codeBlockLang = line.trim().slice(3).trim();
      }
      i++;
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      i++;
      continue;
    }

    // H1 heading
    if (line.trim().startsWith('# ') && !line.trim().startsWith('## ')) {
      const text = line.trim().slice(2);
      elements.push(
        <h1 key={`h1-${i}`} className="md-h1">
          {text}
        </h1>
      );
      i++;
      continue;
    }

    // H2 heading
    if (line.trim().startsWith('## ')) {
      const text = line.trim().slice(3);
      elements.push(
        <h2 key={`h2-${i}`} className="md-h2">
          {text}
        </h2>
      );
      i++;
      continue;
    }

    // Bullet list
    if (line.trim().startsWith('- ')) {
      const listItems = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        const itemContent = lines[i].trim().slice(2);
        // Handle inline code in bullet points
        const processedContent = itemContent.replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>');
        listItems.push(<li key={`li-${i}`} dangerouslySetInnerHTML={{ __html: processedContent }} />);
        i++;
      }
      elements.push(<ul key={`ul-${i}`} className="md-list">{listItems}</ul>);
      continue;
    }

    // Empty line - skip
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Paragraph
    const paraLines = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('- ')
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      const text = paraLines.join(' ').trim();
      // Handle inline code in paragraphs
      const processedText = text.replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>');
      elements.push(
        <p key={`p-${i}`} className="md-paragraph" dangerouslySetInnerHTML={{ __html: processedText }} />
      );
    }
  }

  return <div className="md-content">{elements}</div>;
}
