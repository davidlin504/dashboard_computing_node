import { useEffect, useRef } from 'react'
import { useError } from '../hooks/useError.js'
import { IconAlert } from '../assets/icons/icons.jsx'
import styles from '../styles/ErrorBanner.module.css'

const DISMISS_AFTER_MS = 3000

function ErrorItem({ error }) {
  const { dismissError } = useError()
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => dismissError(error.id), DISMISS_AFTER_MS)
    return () => clearTimeout(timerRef.current)
  }, [error.id, dismissError])

  return (
    <div className={styles.item} role="alert">
      <IconAlert className={styles.icon} />
      <div className={styles.body}>
        <span className={styles.message}>{error.message}</span>
        {error.detail && <span className={styles.detail}>{error.detail}</span>}
      </div>
      <div className={styles.progress} />
      <button
        className={styles.close}
        onClick={() => dismissError(error.id)}
        aria-label="關閉"
      >
        ✕
      </button>
    </div>
  )
}

export default function ErrorBanner() {
  const { errors } = useError()
  if (errors.length === 0) return null

  return (
    <div className={styles.stack}>
      {errors.map(err => <ErrorItem key={err.id} error={err} />)}
    </div>
  )
}
