#!/usr/bin/env node

import '../environment.js'

process.env.NODE_ENV = "development"

const { default: findPort } = await import('find-open-port')
const { default: concurrently } = await import('concurrently')

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
        GUN_SERVER: apiServerUrl+'/gun',
      },
    }
  ],
  {
    killOthers: ['failure', 'success'],
    cwd: process.env.APP_ROOT,
  }
)
