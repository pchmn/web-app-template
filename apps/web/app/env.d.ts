interface ImportMetaEnv {
  VITE_SERVER_URL: string;
  VITE_APP_ENV: 'development' | 'preview' | 'production';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
