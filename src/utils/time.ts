
export function parseSeconds(seconds: number) {
  const hoursDeci = (seconds / 3600)
  const hours = Math.floor(hoursDeci)
  const minutes = Math.round((hoursDeci - hours) * 60)
  return {
    hours,
    minutes
  }
}