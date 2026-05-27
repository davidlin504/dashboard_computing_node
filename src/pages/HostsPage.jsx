import { useState, useMemo } from 'react'
import HostsTable from '../components/HostsTable'
import { useHosts } from '../hooks/useHosts'
import { IconSearch, IconRefresh } from '../assets/icons/icons.jsx'
import styles from '../styles/HostsPage.module.css'

const FILTERS = [
  { label: 'ALL', value: 'all', filter: 'all'},
  { label: 'ON', value: 'on' ,filter: 1},
  { label: 'OFF', value: 'off' ,filter: 0},
  { label: 'PENDING', value: 'pending' ,filter: 'pending'},
  { label: 'BUSY',    value: 'busy' ,filter: 'busy'},
]

export default function HostsPage({ onRequireLogin }) {
  const { hosts, setHosts, loading, refetch } = useHosts()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setTimeout(() => setRefreshing(false), 600)
  }

  const filtered = useMemo(() => {
    return hosts.filter(h => {
      const matchSearch = search.trim() === '' || h.bmc_ip.includes(search.trim())
      const matchFilter = filter === 'all' || h.status === filter || h.power === filter
      return matchSearch && matchFilter
    })
  }, [hosts, search, filter])

  const updateHost = (bmcIp, newData) => {
    // Update the specific host in the state
    const updatedHosts = hosts.map(h => h.bmc_ip === bmcIp ? { ...h, ...newData } : h)
    setHosts(updatedHosts)  // Uncomment if you want to update local state immediately
  }

  const counts = useMemo(() => ({
    all: hosts.length,
    on: hosts.filter(h => h.power === 1).length,
    off: hosts.filter(h => h.power === 0).length,
    pending: hosts.filter(h => h.status === 'pending').length,
    busy: hosts.filter(h => h.status === 'busy').length,
  }), [hosts])

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.pageTitle}>COMPUTE_HOSTS</h1>
            <p className={styles.pageSub}>運算機器管理系統 &nbsp;·&nbsp; 共 {hosts.length} 台</p>
            <span>以 DM_LAN macaddress 區分</span>
          </div>
          <button className={styles.refreshBtn} onClick={handleRefresh} disabled={loading || refreshing}>
            <IconRefresh style={{ width: 16, height: 16 }} className={refreshing ? styles.refreshSpinner : ''} />
            {refreshing ? '更新中...' : '重新整理'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={`${styles.statCard} ${styles.statCardAll}`}>
          <div className={styles.statLabel}>Total</div>
          <div className={styles.statValue}>{counts.all}</div>
        </div>
        <div className={`${styles.statCard} ${styles.statCardPending}`}>
          <div className={styles.statLabel}>Pending</div>
          <div className={styles.statValue}>{counts.pending}</div>
        </div>
        <div className={`${styles.statCard} ${styles.statCardBusy}`}>
          <div className={styles.statLabel}>Busy</div>
          <div className={styles.statValue}>{counts.busy}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <IconSearch className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="搜尋 BMC IP..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.filterTabs}>
          {FILTERS.map(f => (
            <button
              key={f.value}
              className={`${styles.filterTab} ${filter === f.value ? styles.filterTabActive : ''}`}
              onClick={() => setFilter(f.filter)}
            >
              {f.label}
              {f.value !== 'all' && (
                <span style={{ marginLeft: '0.4rem', opacity: 0.7, fontSize: '0.85rem' }}>
                  ({counts[f.value]})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          <div style={{ width: 32, height: 32, border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          載入中...
        </div>
      ) : (
        <HostsTable hosts={filtered} onRequireLogin={onRequireLogin} onUpdate={updateHost} />
      )}
    </main>
  )
}
