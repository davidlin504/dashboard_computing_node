import { useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import HostsPage from './pages/HostsPage'
import LoginModal from './components/LoginModal'
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
      <AppInner />
    </AuthProvider>
  )
}
