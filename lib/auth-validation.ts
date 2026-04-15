export const INVALID_PASSWORD_MESSAGE =
  "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character"

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email)
}

export const isValidPassword = (password: string): boolean => {
  return PASSWORD_REGEX.test(password)
}
