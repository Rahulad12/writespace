export interface EnvTypes {
  port: string;
  dbUser: string;
  dbHost: string;
  dbName: string;
  dbPassword: string;
  dbPort: string;
  jwtSecret: string;
  jwtExpiresIn: string;
}

export interface GithubSettings {
  url: string;
  token?: string;
}

export interface AppSettings {
  github: GithubSettings;
}
