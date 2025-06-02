import React, { useState } from 'react'
import Fuse from 'fuse.js'

export default function SearchBar({ data, onSelect }) {
  const [query, setQuery] = useState('')
  const fuse = new Fuse(data, { keys: ['id'], threshold: 0.4 })

  const results = query ? fuse.search(query).map(r => r.item) : []

  return (
    <div className="searchbar">
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search notes..." />
      <ul>
        {results.map(node => (
          <li key={node.id} onClick={() => onSelect(node)}>
            {node.id}
          </li>
        ))}
      </ul>
    </div>
  )
}
