import { useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import { ErrorProvider } from './context/ErrorContext'
import Navbar from './components/Navbar'
import HostsPage from './pages/HostsPage'
import LoginModal from './components/LoginModal'
import ErrorBanner from './components/ErrorBanner'
import './styles/globals.css'

function AppInner() {
  const [showLogin, setShowLogin] = useState(false)
  const [loginReason, setLoginReason] = useState(null)

  const openLogin = (reason) => {
    setLoginReason(reason || null)
    setShowLogin(true)
  }

  const closeLogin = () => {
    setShowLogin(false)
    setLoginReason(null)
  }

  return (
    <>
      <Navbar onLoginClick={() => openLogin()} />
      <ErrorBanner />
      <HostsPage onRequireLogin={() => openLogin('power')} />
      {showLogin && (
        <LoginModal onClose={closeLogin} redirectReason={loginReason} />
      )}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ErrorProvider>
        <AppInner />
      </ErrorProvider>
    </AuthProvider>
  )
}
