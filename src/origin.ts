import type { Context } from 'hono'
import type { AppEnv } from './types'

/** 公開URLのオリジン。APP_ORIGIN があれば優先 (ローカルのリバースプロキシ用)、なければリクエストURLから */
export function getOrigin(c: Context<AppEnv>): string {
  return new URL(c.env.APP_ORIGIN ?? c.req.url).origin
}
