import React, { useRef, useEffect } from 'react'
import ForceGraph2D from 'react-force-graph'

export default function GraphViewer({ data, onNodeClick }) {
  const ref = useRef()

  useEffect(() => {
    if (ref.current) {
      ref.current.d3Force('charge').strength(-100)
    }
  }, [data])

  return (
    <ForceGraph2D
      ref={ref}
      graphData={data}
      nodeLabel="id"
      nodeAutoColorBy="group"
      onNodeClick={onNodeClick}
    />
  )
}
