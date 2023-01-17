#!/usr/bin/env node

import '../environment.js'

const {default: findPort} = await import('find-open-port')
const {default: concurrently} = await import('concurrently')

const serverPort = await findPort()
const apiServerUrl = `http://localhost:${serverPort}`

await concurrently(
  [
    {
      name: 'server',
      command: `./scripts/dev-server.js`,
      env: {
        PORT: serverPort
      },
    },
    {
      name: 'client',
      command: `./scripts/dev-client.js`,
      env: {
        API_SERVER: apiServerUrl,
      },
    },
  ],
  {
    killOthers: ['failure', 'success'],
    cwd: process.env.APP_PATH,
  }
)
