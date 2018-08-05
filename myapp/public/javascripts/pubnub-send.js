(function(){
      var pubnub = new PubNub({
        publishKey: 'pub-c-37947915-aefe-47fa-a28a-22512d042930',
        subscribeKey: 'sub-c-d0caed0e-942b-11e8-84de-52d6a0ffa615',
        logVerbosity: true,
        ssl: true // may need to set to false if your board doesn't support https (SSL/TLS)
      });
      var channel = 'smart-led';
      var red = document.getElementById('red');
      var green = document.getElementById('green');
      var blue = document.getElementById('blue');
    // Initial brightness state
    var brightness = {r: 0, g: 0, b: 0}; 
    // UI Reset: Subscribe data from all subscibers of the channel to set the state correctly
    pubnub.subscribe({
      channels: [channel]
    });
    pubnub.addListener({
      message: function(message) {
        resetSliders(message);
      },
      status: function(statusEvent) {
        if (statusEvent.category === "PNConnectedCategory") {
          initSliders();
        }
      }
    });
    function resetSliders(m) {
      red.value = brightness.r = m.r;
      green.value = brightness.g = m.g;
      blue.value = brightness.b = m.b;
    }
    function initSliders() {
      pubnub.history(
        {
            channel: channel,
            count: 1
        },
        function (status, response) {
          var msgs = response.messages;
          if (msgs != undefined && msgs.length > 0) {
            // only 1 message fetched, so use element 0 to get it
            msgs[0].forEach(function(m) {
              // loop through the elements of the "brightness" message: r, g & b
              // and reset the Sliders
              console.log(m);
              resetSliders(m);
            });
          }
        }
      );
    }
    function publishUpdate(data) {
      console.log(data);
      pubnub.publish(
      {
        channel: channel,
        message: data
      }, 
      function (status, response) {
        if (status.error) {
          console.log(status)
        } 
        else {
          console.log("message Published w/ timetoken", response.timetoken)
        }
      }
      );
    }
    // UI EVENTS
    red.addEventListener('change', function(e){
      brightness.r = this.value;
      publishUpdate(brightness);
    }, false);
    green.addEventListener('change', function(e){
      brightness.g = this.value;
      publishUpdate(brightness);
    }, false);
    blue.addEventListener('change', function(e){
      brightness.b = this.value;
      publishUpdate(brightness);
    }, false);
})();