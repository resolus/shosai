// `pnpm run deploy` 時に --define で JST の YYYYMMDDHHMMSS が埋め込まれる。未定義 (wrangler dev) なら DEV
declare const __RELEASE__: string

export const RELEASE = typeof __RELEASE__ === 'string' ? __RELEASE__ : 'DEV'
