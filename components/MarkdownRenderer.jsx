'use client';

import React from 'react';

// Simple syntax highlighter for JavaScript
function highlightJS(code) {
  if (!code) return '';

  const keywords = [
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
    'class', 'extends', 'import', 'export', 'default', 'from', 'new', 'this',
    'async', 'await', 'try', 'catch', 'throw', 'typeof', 'instanceof',
    'true', 'false', 'null', 'undefined', 'console', 'log', 'document',
    'querySelector', 'getElementById', 'addEventListener', 'push', 'map',
    'filter', 'reduce', 'find', 'some', 'every', 'includes', 'indexOf'
  ];

  const builtins = ['console', 'document', 'window', 'Math', 'Array', 'Object', 'String', 'Number'];

  let result = code
    // Escape HTML first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

    // Strings
    .replace(/(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="md-string">$1$2$1</span>')

    // Comments
    .replace(/(\/\/.*$)/gm, '<span class="md-comment">$1</span>')
    .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="md-comment">$1</span>')

    // Keywords
    .replace(new RegExp(`\\b(${keywords.join('|')})\\b`, 'g'), '<span class="md-keyword">$1</span>')

    // Numbers
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="md-number">$1</span>')

    // Built-in objects
    .replace(new RegExp(`\\b(${builtins.join('|')})\\b`, 'g'), '<span class="md-builtin">$1</span>')

    // Function calls
    .replace(/\b([a-zA-Z_$][\w$]*)\s*\(/g, '<span class="md-function">$1</span>(');

  return result;
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
        // End code block
        elements.push(
          <div key={`code-${i}`} className="md-code-block">
            <div className="md-code-header">
              <span className="md-code-lang">{codeBlockLang || 'javascript'}</span>
              <div className="md-code-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
            <pre className="md-code-content">
              <code
                dangerouslySetInnerHTML={{ __html: highlightJS(codeBlockContent.join('\n')) }}
              />
            </pre>
          </div>
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
          {parseInlineCode(text)}
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
          {parseInlineCode(text)}
        </h2>
      );
      i++;
      continue;
    }

    // Bullet list
    if (line.trim().startsWith('- ')) {
      const listItems = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        listItems.push(parseListItem(lines[i]));
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
      elements.push(
        <p key={`p-${i}`} className="md-paragraph">
          {parseInlineCode(text)}
        </p>
      );
    }
  }

  return <div className="md-content">{elements}</div>;
}
