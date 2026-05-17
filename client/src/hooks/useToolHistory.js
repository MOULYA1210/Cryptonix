// client/src/hooks/useToolHistory.js
import { saveToolUsageAPI } from '../utils/api'
import useAuth from './useAuth'

const useToolHistory = () => {
  const { user } = useAuth()

  // Call this after any tool action
  const saveUsage = async (toolName, action, metadata = {}) => {
    // Only save if user is logged in
    if (!user) return

    try {
      await saveToolUsageAPI({ toolName, action, metadata })
    } catch {
      // Silently fail — don't interrupt tool usage
      console.warn('Could not save tool history')
    }
  }

  return { saveUsage }
}

export default useToolHistory