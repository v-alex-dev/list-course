/**
 * Utilitaire pour simuler des délais de requête en développement
 * Permet de mieux visualiser les états de loading
 */

export const useDevDelay = () => {
  const isDev = import.meta.env.DEV

  const delay = (ms = 1000) => {
    if (!isDev) return Promise.resolve()
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  const withDelay = async (asyncFn, delayMs = 1000) => {
    if (isDev) {
      await delay(delayMs)
    }
    return await asyncFn()
  }

  return {
    delay,
    withDelay,
    isDev,
  }
}
