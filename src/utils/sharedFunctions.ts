export const getClientName = (user: any) => {
  return `${user?.given_name ?? user?.email ?? ''} ${user?.family_name ?? ''}`
}
