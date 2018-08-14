/**
 * @Author: alcwynparker
 * @Date:   2016-02-01T21:04:02+00:00
 * @Last modified by:   alcwynparker
 * @Last modified time: 2018-04-30T23:47:27+01:00
 */
const io = require('socket.io')(process.env.PORT || 3000)
const shortid = require('shortid')
const robot = require("robotjs")
const os = require('os')
const ifaces = os.networkInterfaces()

let keyboardActive = false

class SocketIO {
  constructor() {
    this.systemInfo() // legacy from original code (NICE TO HAVE!)

    console.log('SocketIO Server listening on port 3000')

    // Used to manage connections
    this.connections = []

    // add listeners
    let connectCallBack = this.initOnConnect.bind(this)
    io.on('connection', connectCallBack)

  }

  /**
   * initOnConnect - Handles a new connection to the SocketIO server
   *
   * @param  {Object} socket event obj
   */
  initOnConnect(socket) {

    // create a new connect object
    var newConnection = {
        id: shortid.generate(),
        channel: null,
        type:null
    }
    // output new user
    console.log(newConnection)

    // add the new connection to the stack
    this.connections[newConnection.id] = newConnection

    // update connected device with unique id
    socket.emit('registeredID', { id: newConnection.id });

    // Alert all connected devices to new connection - mainly useful for the hub
  	socket.broadcast.emit('allConnections', this.connections);

    // add listeners to new connection
  //  let onHardwareCallback = this.onHardware.bind(this)
    socket.on('hardware', this.onHardware(socket))
    socket.on('disconnect', this.onDisconnect(this, newConnection.id, socket))
  }

  /**
   * onHardware - Handles any messages sent from the hardware
   *
   * @param  {Object} socket event info
   */
  onHardware (socket) {
    return function(payload) {
      console.log(payload);
      socket.broadcast.emit('hardware', payload);
      if(payload.type === 'led')this.triggerLED();


      // used for presentation purposes - cheesy but fun
      // if (keyboardActive && payload.type === 'morsecode'){
      //   if (payload.letter === '.') {
      //     robot.keyTap('right');
      //     console.log('right');
      //   }
      //   if (payload.letter === '-') {
      //     robot.keyTap('left');
      //     console.log('left');
      //   }
      // }
    }
  }

  triggerLED (){
    console.log("PHILLIP");
  }

  /**
   * onDisconnect - handles a disonnect
   *
   * @param  {Object} self   scope from parent function - crap but got to get things done
   * @param  {String} id     id of the current connected socket
   * @param  {Object} socket the actual current socket object
   */
  onDisconnect (self, id, socket) {
    return function (payload) {
      delete self.connections[id]
      console.log(self.connections)
      socket.broadcast.emit('disconnected', { id: id})
    }
  }

  /**
   * systemInfo - outputs the local machines network IP for debug purposes
   *
   */
  systemInfo () {
    Object.keys(ifaces).forEach(function (ifname) {
      var alias = 0;

      ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
          return;
        }

        if (alias >= 1) {
          // this single interface has multiple ipv4 addresses
          console.log(ifname + ':' + alias, iface.address)
        } else {
          // this interface has only one ipv4 adress
          console.log(ifname, iface.address)
        }
        ++alias
      })
    })
  }
}

module.exports = new SocketIO()
