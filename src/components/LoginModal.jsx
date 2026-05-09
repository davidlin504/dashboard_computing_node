import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { IconUser, IconLock, IconLogin, IconAlert } from '../assets/icons/icons.jsx'
import styles from '../styles/LoginPage.module.css'

export default function LoginModal({ onClose, redirectReason }) {
  const { login, loading, error, setError } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    setError(null)
  }, [setError])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(username, password)
    if (result.success) onClose()
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(8,12,20,0.85)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className={styles.card} style={{ position: 'relative' }}>
        <div className={styles.logo}>
          <IconLogin className={styles.logoIcon} />
          <span className={styles.logoText}>AUTHENTICATE</span>
        </div>

        <h1 className={styles.title}>管理員登入</h1>
        {redirectReason ? (
          <p className={styles.subtitle}>需要登入才能執行此操作</p>
        ) : (
          <p className={styles.subtitle}>請輸入您的帳號與密碼</p>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="username">使用者名稱</label>
            <div className={styles.inputWrap}>
              <IconUser className={styles.inputIcon} />
              <input
                id="username"
                type="text"
                className={styles.input}
                placeholder="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">密碼</label>
            <div className={styles.inputWrap}>
              <IconLock className={styles.inputIcon} />
              <input
                id="password"
                type="password"
                className={styles.input}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {error && (
            <div className={styles.errorMsg}>
              <IconAlert style={{ width: 18, height: 18, flexShrink: 0 }} />
              {error}
            </div>
          )}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <><span style={{ width: 18, height: 18, border: '2px solid', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />驗證中...</>
            ) : (
              <><IconLogin style={{ width: 18, height: 18 }} />登入</>
            )}
          </button>
        </form>

        {/* <div className={styles.redirectNote}>
          <span>開機操作需要授權</span>
        </div> */}
      </div>
    </div>
  )
}
