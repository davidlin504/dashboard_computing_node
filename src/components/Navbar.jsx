import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { formatTimestamp } from '../utils/helpers'
import {
  IconServer, IconUser, IconLogout, IconLogin
} from '../assets/icons/icons.jsx'
import styles from '../styles/Navbar.module.css'

export default function Navbar({ onLoginClick }) {
  const { user, isLoggedIn, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className={styles.nav}>
        <a className={styles.navBrand} href="/">
          <IconServer className={styles.navLogo} />
          <span className={styles.navTitle}>HOST_MGR</span>
        </a>

        <div className={styles.navSpacer} />

        {/* Desktop user area */}
        <div className={styles.navUser}>
          {isLoggedIn ? (
            <>
              <div className={styles.navUserInfo}>
                <div className={styles.navUserName}>{user.name}</div>
                <div className={styles.navUserTime}>{formatTimestamp(user.lastAccessTime)}</div>
              </div>
              <div className={styles.navUserIcon}>
                <IconUser style={{ width: 18, height: 18 }} />
              </div>
              <button className={styles.navBtn} onClick={logout} title="Logout">
                <IconLogout style={{ width: 16, height: 16 }} />
                登出
              </button>
            </>
          ) : (
            <button className={styles.navBtn} onClick={onLoginClick}>
              <IconLogin style={{ width: 16, height: 16 }} />
              登入
            </button>
          )}
        </div>

        {/* Burger */}
        <button
          className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
        {isLoggedIn ? (
          <>
            <div className={styles.mobileUserInfo}>
              <div className={styles.mobileUserName}>{user.name}</div>
              <div className={styles.mobileUserTime}>{formatTimestamp(user.lastAccessTime)}</div>
            </div>
            <button className={styles.navBtn} onClick={() => { logout(); setMenuOpen(false) }}>
              <IconLogout style={{ width: 16, height: 16 }} />
              登出
            </button>
          </>
        ) : (
          <button className={styles.navBtn} onClick={() => { onLoginClick(); setMenuOpen(false) }}>
            <IconLogin style={{ width: 16, height: 16 }} />
            登入
          </button>
        )}
      </div>
    </>
  )
}
