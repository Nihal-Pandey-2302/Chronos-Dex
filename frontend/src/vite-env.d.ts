/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TESTER_WIF: string
  readonly VITE_TOKEN_A_CATEGORY: string
  readonly VITE_TOKEN_B_CATEGORY: string
  readonly VITE_LP_TOKEN_CATEGORY: string
  readonly VITE_LIQUIDITY_POOL_ADDRESS: string
  readonly VITE_GAMIFICATION_VAULT_ADDRESS: string
  readonly VITE_LIQUIDITY_POOL_ARGS_JSON: string
  readonly VITE_GAMIFICATION_VAULT_ARGS_JSON: string
  readonly VITE_POOL_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}