import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { usePowerOn } from '../hooks/useHosts'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import {
  IconPower, IconCpu, IconChevronLeft, IconChevronRight, IconDatabase,
  IconPowerOff, IconPowerLoading
} from '../assets/icons/icons.jsx'
import styles from '../styles/Table.module.css'
import statusStyle from '../styles/Status.module.css'
import CopyButton from './CopyButton.jsx'

function StatusBadge({ status }) {
  return (
    <span className={statusStyle.badge} data-status={status}>
      <span className={statusStyle.dot} />
      {status}
    </span>
  );
}

const PAGE_SIZE = 5

function Pagination({ hostsLength, page, setPage, summary = true }) {

  const totalPages = Math.max(1, Math.ceil(hostsLength / PAGE_SIZE))
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <>
      {/* Pagination */}
      <div className={styles.pagination}>
        {summary ? (
          <span className={styles.pageInfo}>
            顯示 {hostsLength === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, hostsLength)} / 共 {hostsLength} 筆
          </span>
        ) : null}
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
    </>
  )
}

export default function HostsTable({ hosts, onRequireLogin, onUpdate }) {
  const { isLoggedIn } = useAuth()
  const { powerOperation, loadingMap } = usePowerOn()
  const [page, setPage] = useState(1)
  const tbodyRef = useRef(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1)
  }, [hosts])

  const sliced = hosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // exit duration must match tbodyExitActive transition duration (0.15s)
  const EXIT_DURATION = 150
  // enter duration must cover stagger + transition (0.22s + 160ms delay)
  const ENTER_DURATION = 400

  const handleBoot = async (bmc_ip, power) => {
    if (!isLoggedIn) {
      onRequireLogin()
      return
    }
    await powerOperation(bmc_ip, power, onUpdate)
  }

  return (
    <div>
      <div className={styles.tableWrap}>

        <Pagination
          page={page}
          setPage={setPage}
          hostsLength={hosts.length}
        />

        <table className={styles.table}>
          <thead>
            <tr>
              <th>BMC_IP</th>
              <th>OS_IP</th>
              <th>DM_LAN MAC</th>
              <th>Platform</th>
              <th>Model</th>
              <th>OS</th>
              <th>CPU</th>
              <th>電源</th>
              <th>狀態</th>
              <th>Note</th>
            </tr>
          </thead>

          {/* SwitchTransition waits for exit to finish before entering */}
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={page}
              nodeRef={tbodyRef}
              timeout={{ exit: EXIT_DURATION, enter: ENTER_DURATION }}
              classNames={{
                enter: styles.tbodyEnter,
                enterActive: styles.tbodyEnterActive,
                exit: styles.tbodyExit,
                exitActive: styles.tbodyExitActive,
              }}
            >

              <tbody ref={tbodyRef}>
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
                      <td><span className={styles.mono}>{host.bmc_ip}</span><CopyButton title="copy bmc ip" copiedVal={`https://${host.bmc_ip}`}/></td>
                      <td><span className={styles.mono}>{host.os_ip}<CopyButton title="copy os ip" copiedVal={`ssh root@${host.os_ip}`} /></span></td>
                      <td><span className={styles.mono} style={{ fontSize: '0.85rem' }}>{host.mac_address}</span></td>
                      <td><span className={styles.mono} style={{ fontSize: '0.85rem' }}>{host.platform}</span></td>
                      <td><span className={styles.mono} style={{ fontSize: '0.85rem' }}>{host.model}</span></td>
                      <td><span className={styles.mono} style={{ fontSize: '0.85rem' }}>{host.os}</span></td>
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
                            <IconPowerOff style={{ width: 16, height: 16 }} />
                            OFF
                          </span>
                        )}
                      </td>
                      <td>
                        <StatusBadge status={host.status} />
                      </td>
                      <td>
                        <span className={styles.mono} style={{ fontSize: '0.85rem' }}>{host.note}</span>
                      </td>
                      {/* <td>
                        <span className={`${styles.badge} ${host.active ? styles.badgeActive : styles.badgeInActive}`}>
                          <span className={styles.dot} />
                          {host.active ? 'online' : 'offline'}
                        </span>
                      </td> */}
                      {/* <td>
                        <button
                          className={`${styles.bootBtn} ${loadingMap[host.bmc_ip] ? styles.bootBtnLoading : ''}`}
                          onClick={() => handleBoot(host.bmc_ip, host.power)}
                          disabled={loadingMap[host.bmc_ip] || host.status === 'busy'}
                          title={isLoggedIn ? '開機' : '需要登入'}
                        >
                          {loadingMap[host.bmc_ip] ? (
                            <><IconPowerLoading style={{ width: 16, height: 16, animation: 'spin 0.9s linear infinite' }} />處理中</>
                          ) : (
                            <><IconPower style={{ width: 15, height: 15 }} /><span className={styles.power_action}>{host.power === 1 ? '關機' : '開機'}</span></>
                          )}
                        </button>
                      </td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </CSSTransition>
          </SwitchTransition>
        </table>
        <Pagination
          page={page}
          setPage={setPage}
          hostsLength={hosts.length}
        />
      </div>
    </div>
  )
}
