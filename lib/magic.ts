import { Magic } from 'magic-sdk'
import { OAuthExtension } from '@magic-ext/oauth'

export const magic =
  typeof window !== 'undefined'
    ? new Magic('pk_live_4C679FE162F04FDC', {
        extensions: [new OAuthExtension()],
      })
    : () => {}
