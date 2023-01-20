#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises'
import childProcess from 'child-process-promise'

import '../environment.js'

process.env.NODE_ENV = "development"
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

await childProcess.spawn(
  'npx',
  [
    'nodemon',
    '-w', `${process.env.APP_ROOT}/.env`,
    '-w', `${process.env.APP_ROOT}/package.json`,
    '-w', `${process.env.APP_ROOT}/pnpm-lock.yaml`,
    '--exec',
    'npx',
    'parcel',
    'serve',
    '--port', `${process.env.PORT}`,
    '--no-cache',
    // '--cache-dir', `${process.env.APP_ROOT}/tmp/cache`,
    '--dist-dir', `${process.env.APP_ROOT}/build`,
    `${process.env.APP_ROOT}/client/index.html`,
  ],
  {
    stdio: ['ignore', 'inherit', 'inherit'],
  }
)
