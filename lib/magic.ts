import { Magic } from 'magic-sdk'
import { OAuthExtension } from '@magic-ext/oauth'

export const magic: any =
  typeof window !== 'undefined'
    ? new Magic(process.env.NEXT_PUBLIC_MAGIC_PK, {
        extensions: [new OAuthExtension()],
      })
    : () => {}
