'use client'

function renderInline(text) {
  const parts = []
  let rest = String(text || '')

  while (rest.length) {
    const bold = rest.match(/\*\*(.+?)\*\*/)
    const italic = rest.match(/\*(.+?)\*/)

    let next = null
    let type = null

    if (bold && italic) {
      next = bold.index <= italic.index ? bold : italic
      type = bold.index <= italic.index ? 'bold' : 'italic'
    } else if (bold) {
      next = bold
      type = 'bold'
    } else if (italic) {
      next = italic
      type = 'italic'
    }

    if (!next || next.index === undefined) {
      parts.push(rest)
      break
    }

    if (next.index > 0) parts.push(rest.slice(0, next.index))
    parts.push(type === 'bold' ? <strong key={`${parts.length}-b`}>{next[1]}</strong> : <em key={`${parts.length}-i`}>{next[1]}</em>)
    rest = rest.slice(next.index + next[0].length)
  }

  return parts
}

export default function RichTextBlock({ value, className, style }) {
  const lines = String(value || '').split('\n')
  const blocks = []
  let listItems = []

  const flushList = () => {
    if (!listItems.length) return
    blocks.push(
      <ul key={`ul-${blocks.length}`} style={{ margin: '0 0 12px 18px', padding: 0 }}>
        {listItems.map((item, idx) => <li key={`${idx}-${item}`}>{renderInline(item)}</li>)}
      </ul>
    )
    listItems = []
  }

  lines.forEach((line) => {
    const trimmed = line.trim()
    if (/^[-*]\s+/.test(trimmed)) {
      listItems.push(trimmed.replace(/^[-*]\s+/, ''))
      return
    }
    flushList()
    if (!trimmed) {
      blocks.push(<div key={`sp-${blocks.length}`} style={{ height: 8 }} />)
      return
    }
    blocks.push(<p key={`p-${blocks.length}`} style={{ margin: '0 0 12px' }}>{renderInline(trimmed)}</p>)
  })
  flushList()

  return <div className={className} style={style}>{blocks}</div>
}
