// Check if apng is supported

var aPngSupported = true;

$(function () {
  APNG.ifNeeded()
    .then(function () {
      aPngSupported = false;
    })
});


// Handle play buttons


(function(){
  var appButton = $('.js-app-btn');
  var glanceButton = $('.js-glance-btn');
  var notificationButton = $('.js-notification-btn');

  var baseStage = $('.js-base');
  var appStage = $('.js-app');
  var glanceStage = $('.js-glance');
  var notificationStage = $('.js-notification');

  var appPlaying = false;
  var glancePlaying = false;
  var notificationPlaying = false;

  appButton.on('click', function(){
    handleClick('app')
  });

  glanceButton.on('click', function(){
    handleClick('glance')
  });

  notificationButton.on('click', function(){
    handleClick('notification')
  });

  function handleClick(btn) {
    var playing = checkPlayers();

    if (playing) {
      stopPlayer(playing);

      if(playing != btn) {
        var b = btn;
        setTimeout(function(){
          startPlayer(b)
        },500)
      }
    } else {
      startPlayer(btn)
    }
  }

  function checkPlayers() {
    if (appPlaying) {
      return 'app'
    } else if (glancePlaying) {
      return 'glance'
    } else if (notificationPlaying) {
      return 'notification'
    } else {
      return false
    }
  }

  function stopPlayer(player) {
    if (player == 'app') {
      baseStage.removeClass('zoom');

      appButton.removeClass('active');

      appStage.empty();
      appStage.removeClass('active');

      appPlaying = false;
    } else if (player == 'glance') {
      glanceButton.removeClass('active');

      glanceStage.removeClass('animate');
      glanceStage.parent().removeClass('blur');

      glanceStage.removeClass('active');
      glancePlaying = false;
    } else if (player == 'notification') {
      notificationButton.removeClass('active');

      notificationStage.removeClass('active animate');

      notificationStage.parent().removeClass('blur');

      notificationPlaying = false;

      setTimeout(function(){
        $('.js-scroll').scrollTop(0);
      },500)
    }
  }

  function startPlayer(player) {
    if (player == 'app') {
      baseStage.addClass('zoom');

      appButton.addClass('active');

      var animatedSrc = appStage.data('url');
      var img = '<img src="'+ animatedSrc +'" width="136" height="170" >';

      appStage.append(img);
      appStage.addClass('active');

      if (!aPngSupported) {
        appStage.children("img").each(function () { APNG.animateImage(this); })
      }

      appPlaying = true;
    } else if (player == 'glance') {
      glanceButton.addClass('active');

      glanceStage.addClass('active animate');

      glanceStage.parent().addClass('blur');

      glancePlaying = true;
    } else if (player == 'notification') {
      notificationButton.addClass('active');

      notificationStage.addClass('active animate');

      notificationStage.parent().addClass('blur');

      notificationPlaying = true;
    }
  }




// Handle glance frames

  var tape = $('.js-tape');
  var dots = $('.js-dots').children();
  var tapeWidth = tape.width();
  var index = 0;
  var maxIndex = dots.length - 1;
  var speed = 400;

  dots.on('click', function(){
    var $this = $(this);

    if (!$this.hasClass('active')) {
      index = dots.index($this);

      moveTape(index * tapeWidth, speed)
    }
  });

  //Init touch swipe
  tape.parent().swipe({
    triggerOnTouchEnd: true,
    triggerOnTouchLeave: true,
    swipeStatus: swipeStatus,
    allowPageScroll: "none",
    threshold: 25,
    tap: tap
  });

  function tap(event, target) {
    appButton.trigger('click')
  }

  function swipeStatus(event,phase,direction,distance,fingers) {

    //If we are moving before swipe, and we are going L or R, then manually drag the images
    if (phase == "move") {
      if (direction == "left")
        moveTape((index * tapeWidth) + distance, 0);

      else if (direction == "right")
        moveTape((index * tapeWidth) - distance, 0);

      else if (direction == "down")
        moveTapeParent(distance, 0);

    } else if (phase == "cancel") {
      if (direction == "left")
        moveTape(index * tapeWidth, speed);

      else if (direction == "down")
        tape.parent().removeAttr('style');

    } else if (phase == "end") {
      if (direction == "right") {
        if (index != 0) {
          index -= 1;
        }
        moveTape(index * tapeWidth, speed);
      } else if (direction == "left") {
        if (index != maxIndex) {
          index += 1;
        }
        moveTape(index * tapeWidth, speed);
      } else if (direction == "down") {
        glanceButton.trigger('click');
        tape.parent().removeAttr('style');
      }
    }
  }

  function moveTape(move,duration) {
    var value = (move < 0 ? "" : "-") + Math.abs(move).toString();

    tape.css({
      "-webkit-transition-duration": (duration / 1000).toFixed(1) + "s",
              "transition-duration": (duration / 1000).toFixed(1) + "s",
      "-webkit-transform": "translate3d(" + value + "px,0,0)",
              "transform": "translate3d(" + value + "px,0,0)"
    });

    dots.removeClass('active');
    dots.eq(index).addClass('active');
  }

  function moveTapeParent(move,duration) {
    var value = Math.abs(move).toString();

    tape.parent().css({
      "-webkit-transition-duration": (duration / 1000).toFixed(1) + "s",
              "transition-duration": (duration / 1000).toFixed(1) + "s",
      "-webkit-transform": "translate3d(0," + value + "px,0)",
              "transform": "translate3d(0," + value + "px,0)"
    });
  }

})();



// Insert actual time

(function(){
  var time = $('.js-time');

  function updateClock ( )
  {
    var currentTime = new Date ( );
    var currentHours = currentTime.getHours ( );
    var currentMinutes = currentTime.getMinutes ( );

    // Pad the minutes and seconds with leading zeros, if required
    currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;

    // Compose the string for display
    var currentTimeString = currentHours + ":" + currentMinutes;

    time.html(currentTimeString);
  }

  setInterval(updateClock, 1000);

})();

