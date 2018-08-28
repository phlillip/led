const Sockets = require('./SocketIO')

const express = require('express')
const app = express()

app.use(express.static('public'))
app.get('/', (req, res) => res.send('Hello World!'))

// 0-1024
app.listen(4444, () => console.log('Example app listening on port 4444!'))
