import ws from 'ws'

const wss = new ws.Server({ port: 5000, path: '/groups/join' })

wss.on('connection', (ws) => {
  console.log('connected.')
  ws.send('Hello from server.')

  ws.on('message', (message) => {
    console.log(`Received: ${message}`)

    if (message === 'Stop Alarm') {
      wss.clients.forEach((c) => {
        if (c.readyState === ws.OPEN) c.send(`Stop Alarm!!!`)
      })
    } else {
      ws.send(`Reply from server: ${message}.`)
    }
  })
  ws.on('close', () => console.log('Disconnected.'))
})
