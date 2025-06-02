import React, { useState, useEffect } from 'react'
import GraphViewer from './components/GraphViewer.jsx'
import NoteModal from './components/NoteModal.jsx'
import SearchBar from './components/SearchBar.jsx'
import { parseVault } from '../utils/vaultParser.js'

export default function App() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] })
  const [selectedNote, setSelectedNote] = useState(null)
  const [searchActive, setSearchActive] = useState(false)

  useEffect(() => {
    parseVault().then(setGraphData)
  }, [])

  return (
    <>
      <button className="toggle-btn" onClick={() => setSearchActive(!searchActive)}>
        {searchActive ? 'Hide Search' : 'Search'}
      </button>

      {searchActive && (
        <SearchBar data={graphData.nodes} onSelect={setSelectedNote} />
      )}

      <GraphViewer data={graphData} onNodeClick={setSelectedNote} />

      {selectedNote && (
        <NoteModal node={selectedNote} onClose={() => setSelectedNote(null)} />
      )}
    </>
  )
}
