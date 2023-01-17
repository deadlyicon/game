#!/usr/bin/env node

import childProcess from 'child-process-promise'

process.env.NODE_ENV = "development"
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
import '../environment.js'

await childProcess.spawn(
  'npx',
  [
    'nodemon',
    '-w', `${process.env.APP_PATH}/scripts/start.js`,
    '-w', `${process.env.APP_PATH}/scripts/dev-server.js`,
    '-w', `${process.env.APP_PATH}/package.json`,
    '-w', `${process.env.APP_PATH}/pnpm-lock.yaml`,
    '-w', `${process.env.APP_PATH}/environment.js`,
    '-w', `${process.env.APP_PATH}/lib`,
    '-w', `${process.env.APP_PATH}/server`,
    '--exec',
    `${process.env.APP_PATH}/scripts/start.js`,
  ],
  {
    stdio: ['ignore', 'inherit', 'inherit'],
  }
)
