import { fileURLToPath } from 'url'
import Path from 'path'
import dotenv from 'dotenv'

const APP_ROOT = Path.dirname(fileURLToPath(import.meta.url))

process.env.NODE_ENV ??= 'development'
dotenv.config()
process.env.APP_ROOT = APP_ROOT
process.env.PORT ??= 5100
