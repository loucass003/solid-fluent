declare global {
  interface ImportMeta {
    env: {
      NODE_ENV: 'production' | 'development'
    }
  }
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'production' | 'development'
    }
  }
}

export {}
