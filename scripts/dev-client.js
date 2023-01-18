#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises'
import childProcess from 'child-process-promise'

import '../environment.js'

const {default: findPort} = await import('find-open-port')
const {default: concurrently} = await import('concurrently')

const serverPort = await findPort()
const apiServerUrl = `http://localhost:${serverPort}`

if (!process.env.API_SERVER) throw new Error('ERROR: $API_SERVER is not set')
process.env.NODE_ENV = "development"
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
const proxyrc = {
  // "/.well-known": {
  //   "target": process.env.API_SERVER,
  // },
  // "/api": {
  //   "target": process.env.API_SERVER,
  // },
}

let proxyPrefixes = ['/.well-known', '/api', '/assets']
// try{
//   proxyPrefixes = [
//     ...proxyPrefixes,
//     // ...JSON.parse(await readFile(appPath('.proxyprefixes.json'))),
//   ]
// }catch(error){
//   console.error('failed to load proxy prefixes', error.code, error)
// }

for (const prefix of proxyPrefixes)
  proxyrc[prefix] = { target: process.env.API_SERVER }

await writeFile(
  `${process.env.APP_ROOT}/.proxyrc`,
  JSON.stringify(proxyrc, null, 2)
)

await childProcess.spawn(
  'npx',
  [
    'nodemon',
    '-w', `${process.env.APP_ROOT}/package.json`,
    '-w', `${process.env.APP_ROOT}/pnpm-lock.yaml`,
    '--exec',
    'npx',
    'parcel',
    'serve',
    '--port', `${process.env.PORT}`,
    '--no-cache',
    // '--cache-dir', `${process.env.APP_ROOT}/tmp/cache`,
    '--dist-dir', `${process.env.APP_ROOT}/client-build`,
    `${process.env.APP_ROOT}/client/index.html`,
  ],
  {
    stdio: ['ignore', 'inherit', 'inherit'],
  }
)
