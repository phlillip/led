/**
 * @Author: alcwynparker
 * @Date:   2016-02-01T21:04:02+00:00
 * @Last modified by:   alcwynparker
 * @Last modified time: 2018-04-30T23:47:27+01:00
 */
// import JohnnyFive

class JohnnyFive {
  // where setup happens
  constructor() {
    // instantiate JohnnyFive
    console.log('JohnnyFive is Alive!!!!!!!!')
    // setup addEventListener
  }

  lightOn(){
    console.log('Light On')
  }

  lightOff(){
    console.log('Light Off')
  }

  waterOn(duration){
    console.log('Water On for ' + duration + 'mins')
  }
}

module.exports = new JohnnyFive()
