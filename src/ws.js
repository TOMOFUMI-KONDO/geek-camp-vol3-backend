import ws from 'ws'

const socket = new ws.Server({ port: 5000 })

socket.on('connection', (ws) => {
  console.log('connected.')
  ws.send('Hello from server.')

  ws.on('message', (message) => ws.send(`Reply from server: ${message}.`))
  ws.on('close', () => console.log('Disconnected.'))
})
