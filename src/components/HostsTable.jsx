import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { usePowerOn } from '../hooks/useHosts'
import {
  IconPower, IconCpu, IconChevronLeft, IconChevronRight, IconDatabase
} from '../assets/icons/icons.jsx'
import styles from '../styles/Table.module.css'

const PAGE_SIZE = 5

export default function HostsTable({ hosts, onRequireLogin }) {
  const { isLoggedIn } = useAuth()
  const { powerOperation, loadingMap } = usePowerOn()
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(hosts.length / PAGE_SIZE))
  const sliced = hosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleBoot = async (bmc_ip, power) => {
    if (!isLoggedIn) {
      onRequireLogin()
      return
    }
    await powerOperation(bmc_ip, power)
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>BMC_IP</th>
              <th>OS_IP</th>
              <th>MAC</th>
              <th>CPU</th>
              <th>電源</th>
              <th>狀態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {sliced.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className={styles.emptyState}>
                    <IconDatabase className={styles.emptyIcon} />
                    <p className={styles.emptyText}>無符合條件的機器</p>
                  </div>
                </td>
              </tr>
            ) : (
              sliced.map((host, i) => (
                <tr key={host.bmc_ip} style={{ animationDelay: `${i * 50}ms` }}>
                  <td><span className={styles.mono}>{host.bmc_ip}</span></td>
                  <td><span className={styles.mono}>{host.os_ip}</span></td>
                  <td><span className={styles.mono} style={{ fontSize: '0.85rem' }}>{host.mac_address}</span></td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <IconCpu style={{ width: 15, height: 15, color: 'var(--text-muted)', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{host.cpu}</span>
                    </span>
                  </td>
                  <td>
                    {host.power === 1 ? (
                      <span className={styles.powerOn}>
                        <IconPower style={{ width: 16, height: 16 }} />
                        ON
                      </span>
                    ) : (
                      <span className={styles.powerOff}>
                        <IconPower style={{ width: 16, height: 16 }} />
                        OFF
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`${styles.badge} ${host.status === 'busy' ? styles.badgeBusy : styles.badgePending}`}>
                      <span className={`${styles.dot} ${host.status === 'busy' ? styles.dotBusy : ''}`} />
                      {host.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`${styles.bootBtn} ${loadingMap[host.bmc_ip] ? styles.bootBtnLoading : ''}`}
                      onClick={() => handleBoot(host.bmc_ip, host.power)}
                      disabled={loadingMap[host.bmc_ip] || host.status === 'busy' }
                      title={isLoggedIn ? '開機' : '需要登入'}
                    >
                      {loadingMap[host.bmc_ip] ? (
                        <><span className={styles.spinner} />處理中</>
                      ) : (
                        <><IconPower style={{ width: 15, height: 15 }} />{host.power === 1 ? '關機' : '開機'}</>
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className={styles.pagination}>
          <span className={styles.pageInfo}>
            顯示 {hosts.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, hosts.length)} / 共 {hosts.length} 筆
          </span>
          <div className={styles.pageButtons}>
            <button
              className={styles.pageBtn}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="上一頁"
            >
              <IconChevronLeft style={{ width: 16, height: 16 }} />
            </button>
            {pageNumbers.map(n => (
              <button
                key={n}
                className={`${styles.pageBtn} ${n === page ? styles.pageBtnActive : ''}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            <button
              className={styles.pageBtn}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="下一頁"
            >
              <IconChevronRight style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
