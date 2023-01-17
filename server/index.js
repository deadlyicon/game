import { promisify } from 'node:util'
import Path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import expressSession from 'express-session'

import '../environment.js'

const app = express()
export { app }

app.start = function(){
  app.server = app.listen(process.env.PORT, () => {
    const { port } = app.server.address()
    const host = `http://localhost:${port}`
    console.log(`Listening on port ${host}`)
  })
}

// app.use(pinoHTTP())

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache')
  next()
})

// Serve production build
const buildPath = process.env.BUILD_PATH
if (process.env.NODE_ENV === 'production') {
  // TODO res.setHeader("Cache-Control", "public, max-age=604800, immutable")
  app.use(express.static(buildPath, {
    setHeaders(res, path, stat){
      res.set('Cache-Control', 'no-cache')
    }
  }))
}

app.use('/api/', express.urlencoded({
  extended: true,
}))

app.use('/api/', bodyParser.json({
  limit: 102400 * 10,
}))



// Serve production build
if (process.env.NODE_ENV === 'production') {
  const indexPath = Path.join(buildPath, 'index.html')
  app.get('/*', function (req, res, next) {
    if (req.xhr) return next()
    // TODO check accepts header for text/html
    res.setHeader("Cache-Control", "public, max-age=604800, immutable")
    res.sendFile(indexPath)
  })
}

app.use((error, req, res, next) => {
  console.error('EXPRESS ERROR', error)
  if (!res.headersSent) {
    res.status(500)
    if (req.accepts('json')){
      res.json({ error: { message: 'Something unexpected has happened :/' } })
    }else {
      res.send('Something unexpected has happened :/')
    }
  }else{
    console.error('UNREPORTED ERROR (headers already sent)', error)
  }
})
