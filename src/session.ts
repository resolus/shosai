import type { Context } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { sign, verify } from 'hono/jwt'
import { getOrigin } from './origin'
import type { AppEnv, User } from './types'

const COOKIE_NAME = 'session'
const MAX_AGE = 60 * 60 * 24 * 7 // 7日

export async function createSession(c: Context<AppEnv>, userId: string) {
  const now = Math.floor(Date.now() / 1000)
  const token = await sign({ sub: userId, iat: now, exp: now + MAX_AGE }, c.env.SESSION_SECRET, 'HS256')
  setCookie(c, COOKIE_NAME, token, {
    path: '/',
    httpOnly: true,
    secure: getOrigin(c).startsWith('https:'),
    sameSite: 'Lax',
    maxAge: MAX_AGE,
  })
}

export function clearSession(c: Context<AppEnv>) {
  deleteCookie(c, COOKIE_NAME, { path: '/' })
}

async function getSessionUserId(c: Context<AppEnv>): Promise<string | null> {
  const token = getCookie(c, COOKIE_NAME)
  if (!token) return null
  try {
    const payload = await verify(token, c.env.SESSION_SECRET, 'HS256')
    return typeof payload.sub === 'string' ? payload.sub : null
  } catch {
    return null
  }
}

/** ログイン必須ルート用。未ログインならトップへリダイレクト */
export const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
  const userId = await getSessionUserId(c)
  const user = userId
    ? await c.env.DB.prepare('SELECT id, email, name, picture FROM users WHERE id = ?').bind(userId).first<User>()
    : null
  if (!user) {
    clearSession(c)
    return c.redirect('/')
  }
  c.set('user', user)
  await next()
})
