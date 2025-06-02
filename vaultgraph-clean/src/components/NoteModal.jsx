import React from 'react'
import { marked } from 'marked'

export default function NoteModal({ node, onClose }) {
  if (node.url) {
    window.open(node.url, '_blank')
    onClose()
    return null
  }

  return (
    <div className="modal">
      <button onClick={onClose}>×</button>
      <div dangerouslySetInnerHTML={{ __html: marked.parse(node.content || '') }} />
    </div>
  )
}
