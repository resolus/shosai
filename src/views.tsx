import { raw } from 'hono/html'
import type { Child } from 'hono/jsx'
import { RELEASE } from './release'

export const Layout = ({ title, children }: { title: string; children: Child }) => (
  <>
    {raw('<!DOCTYPE html>')}
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        <link rel="stylesheet" href="/static/style.css" />
      </head>
      <body class="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
        <footer class="mt-16 py-6 text-center text-xs text-gray-400">ver. {RELEASE}</footer>
      </body>
    </html>
  </>
)
