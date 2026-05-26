import { useState } from 'react'
import styles from './CopyButton.module.css'


// ── Copy icon (clipboard) ────────────────────────────────────────────────────
function CopyIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="5" width="8" height="8" rx="1.5" />
      <path d="M9 5V3a1.5 1.5 0 0 0-1.5-1.5H3A1.5 1.5 0 0 0 1.5 3v4.5A1.5 1.5 0 0 0 3 9h2" />
    </svg>
  )
}

// ── Check icon (copied feedback) ─────────────────────────────────────────────
function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 7l3.5 3.5L12 3" />
    </svg>
  )
}



export function handleCopy(e, ip, succeed) {
  e.stopPropagation()
  if (!ip) return

  // Modern API (HTTPS / localhost)
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(ip).then(() => succeed(ip))
    return
  }

  console.log('Clipboard API not supported, falling back to execCommand')
  console.log(ip)
  // Fallback: execCommand (HTTP environments)
  try {
    const el = document.createElement('textarea')
    el.value = ip
    el.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0'
    document.body.appendChild(el)
    el.focus()
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    succeed(ip)
  } catch {
    console.warn('Copy failed')
  }
}

export default function CopyButton(props) {
  const { copiedVal, title, children } = props
  const [copiedKey, setCopiedKey] = useState(null)

  const succeed = (key) => {
    setCopiedKey(key)
    console.log('copy success')
    setTimeout(() => setCopiedKey(null), 1800)
  }

  return (
    <button
      className={`${styles.copyBtn} ${copiedKey == copiedVal ? styles.copyDone : ''}`}
      onClick={(e) => handleCopy(e, copiedVal, succeed)}
      title={title}
    >
      {children}
      {copiedKey === copiedVal ? <CheckIcon /> : <CopyIcon />}
    </button>
)
}