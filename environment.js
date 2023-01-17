import { fileURLToPath } from 'url'
import Path from 'path'
import dotenv from 'dotenv'

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development'

const APP_ROOT = Path.dirname(fileURLToPath(import.meta.url))

dotenv.config()
process.env.APP_ROOT = APP_ROOT
process.env.BUILD_PATH = Path.join(APP_ROOT, 'client-build')
process.env.GUN_STORAGE_PATH ??= Path.join(APP_ROOT, 'gun-store')
