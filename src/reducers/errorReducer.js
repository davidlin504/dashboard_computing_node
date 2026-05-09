export const ERROR_ACTIONS = {
  PUSH: 'PUSH',
  DISMISS: 'DISMISS',
  CLEAR_ALL: 'CLEAR_ALL',
}

/**
 * @typedef {{ id: number, message: string, detail?: string }} ApiError
 * @param {ApiError[]} state
 * @param {{ type: string, payload?: Partial<ApiError> }} action
 * @returns {ApiError[]}
 */
export function errorReducer(state, action) {
  switch (action.type) {
    case ERROR_ACTIONS.PUSH:
      return [...state, { id: Date.now(), message: '', ...action.payload }]
    case ERROR_ACTIONS.DISMISS:
      return state.filter(e => e.id !== action.payload.id)
    case ERROR_ACTIONS.CLEAR_ALL:
      return []
    default:
      return state
  }
}
