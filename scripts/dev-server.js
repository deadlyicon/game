#!/usr/bin/env node

import childProcess from 'child-process-promise'

process.env.NODE_ENV = "development"
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
import '../environment.js'

await childProcess.spawn(
  'npx',
  [
    'nodemon',
    '-w', `${process.env.APP_ROOT}/scripts/start.js`,
    '-w', `${process.env.APP_ROOT}/scripts/dev-server.js`,
    '-w', `${process.env.APP_ROOT}/package.json`,
    '-w', `${process.env.APP_ROOT}/pnpm-lock.yaml`,
    '-w', `${process.env.APP_ROOT}/environment.js`,
    '-w', `${process.env.APP_ROOT}/lib`,
    '-w', `${process.env.APP_ROOT}/server`,
    '--exec',
    `${process.env.APP_ROOT}/scripts/start.js`,
  ],
  {
    stdio: ['ignore', 'inherit', 'inherit'],
  }
)
