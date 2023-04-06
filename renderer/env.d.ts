declare namespace NodeJS {
    export interface ProcessEnv {
      /**
       * Built-in environment variable.
       * @see Docs https://github.com/chihab/ngx-env#ng_app_env.
       */
      readonly NG_APP_ENV: string;

      // Add your environment variables below

      readonly NG_APP_GOOGLE_API_KEY: string;
    }
  }