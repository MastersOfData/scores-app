
export type Validation = {
  valid: boolean,
  error?: string
}

export function validatePassword(password: string): Validation {
  if (password.length < 8 || password.length > 64) return {
    valid: false,
    error: "Password must be between 8 and 64 characters long"
  }

  if (!/[a-zøæå]+/.test(password)) return {
    valid: false,
    error: "Password must contain at least one lower case character"
  }

  if (!/[A-ZØÆÅ]+/.test(password)) return {
    valid: false,
    error: "Password must contain at least one upper case character"
  }

  if (!/[0-9]+/.test(password)) return {
    valid: false,
    error: "Password must contain at least one digit"
  }

  return {
    valid: true
  }
}