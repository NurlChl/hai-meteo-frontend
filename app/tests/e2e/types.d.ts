import 'vitest'

declare module 'vitest' {
  interface Assertion<T = any> {
    toBeVisible: (options?: { timeout?: number }) => Promise<void>
    toHaveURL: (url: RegExp | string) => Promise<void>
  }

  interface AsymmetricMatchersContaining {
    toBeVisible: (options?: { timeout?: number }) => Promise<void>
    toHaveURL: (url: RegExp | string) => Promise<void>
  }
}
