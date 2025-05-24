/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DISABLE_REACT_DEVTOOLS: string;
  readonly VITE_DROP_CONSOLE: string;
  // add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
