import { useState, useCallback, useEffect } from 'react'
import { MOCK_HOSTS } from '../utils/helpers'
import { useAuth } from '../hooks/useAuth'
import { useError } from '../hooks/useError'
import { API } from '../constants'

export function useHosts() {
  const [hosts, setHosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // const loadMockData = async () => {
  //   const data = await Promise.resolve(MOCK_HOSTS);
  //   setHosts(data);
  // };

  const fetchHosts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(API.hosts)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setHosts(data)
    } catch (err) {
      // Fall back to mock data when backend is unavailable
      console.warn('Backend unavailable, using mock data:', err.message)
      const mock_res = await fetch(`${import.meta.env.VITE_APP_BASE}/status.json`)
      const mock_data = await mock_res.json()
      setHosts(mock_data)
    } finally {
      setLoading(false)
    }
  }, [])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchHosts() }, [fetchHosts])

  return { hosts, setHosts, loading, error, refetch: fetchHosts }
}

export function usePowerOn() {
  const [loadingMap, setLoadingMap] = useState({})
  const { csrfToken } = useAuth()
  const { pushError } = useError()

  const powerOperation = useCallback(async (bmcIp, power, onUpdate, onSuccess) => {
    setLoadingMap(prev => ({ ...prev, [bmcIp]: true }))
    try {
      const res = await fetch(API.power, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // 'X-CSRFTOKEN': csrfToken || '',
          'If-None-Match': '*',
        },
        body: JSON.stringify({ bmc_ip: bmcIp, power_state: power == 1 ? 0 : 1 }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      onSuccess && onSuccess(bmcIp)
      onUpdate(bmcIp, { power: power == 1 ? 0 : 1 })  // Optimistically update UI
      return { success: true }
    } catch (err) {
      console.error('Power on failed:', err)
      pushError?.(`電源操作: ${power == 1 ? '關機' : '開機'}失敗 ${bmcIp}`, err.message)
      return { success: false, error: err.message }
    } finally {
      setTimeout(() => setLoadingMap(prev => ({ ...prev, [bmcIp]: false })), 5000)
    }
  }, [csrfToken, pushError])

  return { powerOperation, loadingMap }
}
