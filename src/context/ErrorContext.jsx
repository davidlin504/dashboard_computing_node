import { useReducer } from 'react'
import { errorReducer, ERROR_ACTIONS } from '../reducers/errorReducer'
import { ErrorContext } from '../hooks/useError'


export function ErrorProvider({ children }) {
  const [errors, dispatch] = useReducer(errorReducer, [])

  const pushError = (message, detail) =>
    dispatch({ type: ERROR_ACTIONS.PUSH, payload: { message, detail } })

  const dismissError = (id) =>
    dispatch({ type: ERROR_ACTIONS.DISMISS, payload: { id } })

  const clearAll = () =>
    dispatch({ type: ERROR_ACTIONS.CLEAR_ALL })

  return (
    <ErrorContext.Provider value={{ errors, pushError, dismissError, clearAll }}>
      {children}
    </ErrorContext.Provider>
  )
}

