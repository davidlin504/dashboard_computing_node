/**
 * Format a timestamp (ms or seconds) to YYYY/MM/DD HH:MM:SS (24-hour)
 */
export function formatTimestamp(ts) {
  if (!ts) return '—'
  // Handle both seconds and milliseconds
  const ms = ts > 1e12 ? ts : ts * 1000
  const d = new Date(ms)
  if (isNaN(d.getTime())) return '—'
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

/**
 * Mock host data — replace with real API calls to GET /hosts
 */
export const MOCK_HOSTS = [
  { bmc_ip: '172.16.87.10', os_ip: '192.16.87.10', mac_address: '00:1A:2B:3C:4D:5E', power: 1, cpu: 'intel_6515', active: true,  status: 'busy'    },
  { bmc_ip: '172.16.87.11', os_ip: '192.16.87.11', mac_address: '00:1A:2B:3C:4D:5F', power: 0, cpu: 'intel_6515', active: true,  status: 'pending'  },
  { bmc_ip: '172.16.87.12', os_ip: '192.16.87.12', mac_address: 'AA:BB:CC:DD:EE:01', power: 1, cpu: 'amd_epyc_7742', active: true,  status: 'busy'    },
  { bmc_ip: '172.16.87.13', os_ip: '192.16.87.13', mac_address: 'AA:BB:CC:DD:EE:02', power: 0, cpu: 'amd_epyc_7742', active: false, status: 'pending'  },
  { bmc_ip: '172.16.87.14', os_ip: '192.16.87.14', mac_address: 'AA:BB:CC:DD:EE:03', power: 1, cpu: 'intel_xeon_8380', active: true,  status: 'busy'    },
  { bmc_ip: '172.16.87.15', os_ip: '192.16.87.15', mac_address: 'AA:BB:CC:DD:EE:04', power: 0, cpu: 'intel_xeon_8380', active: true,  status: 'pending'  },
  { bmc_ip: '172.16.87.16', os_ip: '192.16.87.16', mac_address: 'AA:BB:CC:DD:EE:05', power: 1, cpu: 'amd_epyc_9654', active: true,  status: 'busy'    },
  { bmc_ip: '172.16.87.17', os_ip: '192.16.87.17', mac_address: 'AA:BB:CC:DD:EE:06', power: 0, cpu: 'amd_epyc_9654', active: false, status: 'pending'  },
  { bmc_ip: '172.16.87.18', os_ip: '192.16.87.18', mac_address: 'AA:BB:CC:DD:EE:07', power: 1, cpu: 'intel_6515',    active: true,  status: 'busy'    },
  { bmc_ip: '172.16.87.19', os_ip: '192.16.87.19', mac_address: 'AA:BB:CC:DD:EE:08', power: 0, cpu: 'intel_6515',    active: true,  status: 'pending'  },
  { bmc_ip: '172.16.87.20', os_ip: '192.16.87.20', mac_address: 'AA:BB:CC:DD:EE:09', power: 1, cpu: 'amd_epyc_7742', active: true,  status: 'busy'    },
]
