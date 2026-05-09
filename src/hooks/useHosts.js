import { useState, useCallback, useEffect } from 'react'
import { MOCK_HOSTS } from '../utils/helpers'

const API_BASE = ''

export function useHosts() {
  const [hosts, setHosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchHosts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/hosts`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setHosts(data)
    } catch (err) {
      // Fall back to mock data when backend is unavailable
      console.warn('Backend unavailable, using mock data:', err.message)
      setHosts(MOCK_HOSTS)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchHosts() }, [fetchHosts])

  return { hosts, loading, error, refetch: fetchHosts }
}

export function usePowerOn() {
  const [loadingMap, setLoadingMap] = useState({})

  const powerOn = useCallback(async (bmcIp, power, csrfToken, onSuccess) => {
    setLoadingMap(prev => ({ ...prev, [bmcIp]: true }))
    try {
      const res = await fetch(`${API_BASE}/power`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFTOKEN': csrfToken || '',
          'If-None-Match': '*',
        },
        body: JSON.stringify({ bmc_ip: bmcIp, power: power == 1 ? 0 : 1 }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      onSuccess && onSuccess(bmcIp)
      return { success: true }
    } catch (err) {
      console.error('Power on failed:', err)
      return { success: false, error: err.message }
    } finally {
      setLoadingMap(prev => ({ ...prev, [bmcIp]: false }))
    }
  }, [])

  return { powerOn, loadingMap }
}
