import { googleAuth } from '@hono/oauth-providers/google'
import { Hono } from 'hono'
import { getOrigin } from './origin'
import { clearSession, createSession, requireAuth } from './session'
import type { AppEnv } from './types'
import { Layout } from './views'

const app = new Hono<AppEnv>()

app.get('/', (c) =>
  c.html(
    <Layout title="shosai">
      <h1>shosai</h1>
      <a href="/auth/google">Googleでログイン</a>
    </Layout>,
  ),
)

// Google OAuth: 初回アクセスで Google へリダイレクト、コールバックも同じパスで受ける
app.get(
  '/auth/google',
  (c, next) =>
    googleAuth({
      client_id: c.env.GOOGLE_CLIENT_ID,
      client_secret: c.env.GOOGLE_CLIENT_SECRET,
      scope: ['openid', 'email', 'profile'],
      redirect_uri: `${getOrigin(c)}/auth/google`,
      prompt: 'select_account',
    })(c, next),
  async (c) => {
    const g = c.get('user-google')
    if (!g?.id || !g.email || !g.verified_email) {
      return c.text('Googleアカウント情報を取得できませんでした', 401)
    }
    await c.env.DB.prepare(
      `INSERT INTO users (id, email, name, picture) VALUES (?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         email = excluded.email, name = excluded.name, picture = excluded.picture,
         updated_at = datetime('now')`,
    )
      .bind(g.id, g.email, g.name ?? null, g.picture ?? null)
      .run()
    await createSession(c, g.id)
    return c.redirect('/me')
  },
)

app.post('/logout', (c) => {
  clearSession(c)
  return c.redirect('/')
})

app.get('/me', requireAuth, (c) => {
  const user = c.get('user')
  return c.html(
    <Layout title="マイページ | shosai">
      <h1>{user.name ?? user.email} さんのページ</h1>
      {user.picture && <img src={user.picture} alt="" width={64} height={64} referrerpolicy="no-referrer" />}
      <p>{user.email}</p>
      <form method="post" action="/logout">
        <button type="submit" class="text-red-700">ログアウト</button>
      </form>
    </Layout>,
  )
})

export default app
