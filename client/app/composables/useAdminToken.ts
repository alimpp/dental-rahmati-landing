const TOKEN_COOKIE = 'dadsar_admin_token'

export function useAdminToken() {
  return useCookie<string | null>(TOKEN_COOKIE, {
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}
