import { useContext, createContext } from 'react'
export const ErrorContext = createContext(null)

export function useError() {
  const ctx = useContext(ErrorContext)
  if (!ctx) throw new Error('useError must be used within ErrorProvider')
  return ctx
}
