
export type PasswordValidation = {
  result: boolean,
  error?: string
}

export function validatePassword(password: string): PasswordValidation {
  if (password.length < 8 || password.length > 64) return {
    result: false,
    error: "Password must be between 8 and 64 characters long"
  }

  if (!/[a-z]+/.test(password)) return {
    result: false,
    error: "Password must contain at least one lower case character"
  }

  if (!/[A-Z]+/.test(password)) return {
    result: false,
    error: "Password must contain at least one upper case character"
  }

  return {
    result: true
  }
}