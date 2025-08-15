// components/MarkdownTest.tsx
import React from 'react'

export default function MarkdownTest() {
  return (
    <div className="prose dark:prose-invert max-w-none mx-auto p-6">
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <p>This is a <strong>bold</strong> paragraph.</p>
      <ol>
        <li>Bullet 1</li>
        <li>Bullet 2</li>
      </ol>
    </div>
  )
}
