export type Bindings = {
  DB: D1Database
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  SESSION_SECRET: string
  /** 公開URLのオリジン上書き (例: https://shosai.lvh.me)。本番では未設定でよい */
  APP_ORIGIN?: string
}

export type User = {
  id: string
  email: string
  name: string | null
  picture: string | null
}

export type Variables = {
  user: User
}

export type AppEnv = { Bindings: Bindings; Variables: Variables }
