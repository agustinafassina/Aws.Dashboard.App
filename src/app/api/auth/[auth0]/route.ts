import { handleAuth, handleCallback } from '@auth0/nextjs-auth0'
import { NextApiRequest } from 'next'

const afterCallback = (req: NextApiRequest, session: any, state: any) => {
  return session
}
export const GET = handleAuth({
  callback: handleCallback({ afterCallback }),
})
