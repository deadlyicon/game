#!/usr/bin/env node

if (!process.env.NODE_ENV) process.env.NODE_ENV = "production"
console.log(`starting server in NODE_ENV=${process.env.NODE_ENV}`)

process.on('unhandledRejection', function (exception) {
  console.error('!!! unhandledRejection !!!\n\n')
  console.error(exception)
  process.exit(1)
});

process.on('uncaughtException', function (exception) {
  console.error('!!! uncaughtException !!!\n\n')
  console.error(exception)
  process.exit(1)
});

const { app } = await import('../server/index.js')
await app.start()
