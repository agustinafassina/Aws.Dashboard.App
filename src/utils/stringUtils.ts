/**
 * Extracts initials from a name (up to 2 characters)
 * @param name The full name to extract initials from
 * @returns The first letters of each word in the name, up to 2 characters
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .substring(0, 2)
}
export const cleanString = (value: string) => {
  if (!value) return ''
  return value
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s !== '')
    .join(', ')
}

export const capitalizeString = (value: string) => {
  if (!value) return ''
  return value.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}
