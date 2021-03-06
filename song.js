// Generated by CoffeeScript 1.7.1
(function() {
  'use strict';
  var Callback, Playlist, Song, clean, dismantle, fetch, fetched, resetSongs, root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  try {
    new Audio();
  } catch (_error) {
    return this.Playlist = void 0;
  }

  Callback = (function(){var t,n,i=[].slice;return n={},t=function(){function t(t){if(null==t&&(t=null),null===t&&(t=function(){}),t.constructor!==Function)throw new Error("That ain't no function, missy");this.callback=t,this.fired=[],this.cancelled=!1,this["this"]=null,this.pass=null,this.conditional=null,this.error=null}return t.prototype.config=function(t){var n;if("object"!=typeof t)return!1;for(n in t)this.hasOwnProperty(n)&&(this[n]=t[n]);return this},t.prototype.cancel=function(n,i){return null==n&&(n=null),null==i&&(i=null),null===n?this.cancelled=!0:new t(function(t){return function(){return t.cancelled=!0}}(this)).when(n,i),this},t.prototype.renew=function(n,i){return null==n&&(n=null),null==i&&(i=null),null===n?this.cancelled=!1:new t(function(t){return function(){return t.cancelled=!1}}(this)).when(n,i),this},t.prototype["catch"]=function(t){return t?(this.error=t,this):void 0},t.prototype.when=function(t,i){var e,r;if(t){switch(t.constructor){case String:n[t]||(n[t]=new Array),n[t].push(this);break;case Number:r=t,e=i,e?setInterval(function(t){return function(){return t.invoke()}}(this),r):setTimeout(function(t){return function(){return t.invoke()}}(this),r);break;default:try{i=i.toLowerCase()}catch(l){}if("load"===i)switch(t.readyState){case"complete":case 4:this.invoke(t)}"function"==typeof t.addEventListener&&t.addEventListener(i,function(t){return function(n){return t.invoke(n)}}(this))}return this}},t.prototype["if"]=function(t){return"function"!=typeof t?!1:(this.conditional=t,this)},t.prototype.invoke=function(t){var n,i;if(null==t&&(t=null),this.cancelled)return!1;if(this.conditional&&(n=this.conditional(),!n))return n;try{null!=this["this"]&&null!=this.pass?this.callback.call(this["this"],this.pass):null!=this["this"]&&null!=t?this.callback.call(this["this"],t):null==this["this"]||t?null!=this.pass?this.callback(this.pass):null!=t?this.callback(t):this.callback():this.callback.call(this["this"]),this.fired.push(new Date)}catch(e){if(i=e,!this.error)throw i;this.error(i)}return this},t}(),t.fire=function(){var t,e,r,l,s,c;if(r=arguments[0],t=2<=arguments.length?i.call(arguments,1):[],"string"==typeof r&&n[r]){for(c=n[r],l=0,s=c.length;s>l;l++){e=c[l];try{t.length?e.invoke(t):e.invoke()}catch(u){}}return n[r]}},t}).call(this);

  root = this;

  fetched = {};

  fetch = function(url) {
    var request;
    if (fetched[url]) {
      this.add(fetched[url]);
    } else {
      request = new XMLHttpRequest();
      request.open('get', url, true);
      new Callback((function(_this) {
        return function() {
          var songs;
          songs = JSON.parse(request.responseText);
          fetched[url] = songs;
          return _this.add(songs);
        };
      })(this)).when(request, 'load');
      request.send();
      this.songRequest = request;
    }
    return this;
  };

  dismantle = function(array) {
    var object, _i, _len;
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      object = array[_i];
      this.add(object);
    }
    return this;
  };

  Song = function(song) {
    var audio;
    audio = new Audio();
    if (song.src) {
      audio.src = song.src;
    }
    if (song.title) {
      audio.setAttribute('data-title', song.title);
    }
    if (song.img) {
      audio.setAttribute('data-img', song.img);
    }
    new Callback((function(_this) {
      return function() {
        return _this.event.fire('playing', !audio.paused);
      };
    })(this)).when(audio, 'playing').when(audio, 'pause');
    new Callback((function(_this) {
      return function() {
        return resetSongs(_this, audio);
      };
    })(this)).when(audio, 'playing');
    return audio;
  };

  clean = function(array) {
    var value, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      value = array[_i];
      if (value) {
        _results.push(value);
      }
    }
    return _results;
  };

  resetSongs = function(playlist, exception) {
    var song, _i, _len;
    playlist = playlist.songs;
    for (_i = 0, _len = playlist.length; _i < _len; _i++) {
      song = playlist[_i];
      if (song !== exception) {
        try {
          song.pause();
          song.currentTime = 0;
        } catch (_error) {}
      }
    }
    return playlist;
  };

  Playlist = (function() {
    function Playlist(name) {
      this.name = name;
      this.onChange = __bind(this.onChange, this);
      this.songRequest = {};
      this.songRequest.readyState = 'complete';
      this.songs = [];
      this.repeatState = false;
      this.songNumber = 0;
      this.event = {
        fire: function(type, arg) {
          var callback, _i, _len, _ref, _results;
          if (this.hasOwnProperty(type === false)) {
            return;
          }
          if (this[type].constructor !== Array) {
            return;
          }
          _ref = this[type];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            callback = _ref[_i];
            try {
              if (arg === void 0) {
                _results.push(callback(this));
              } else {
                _results.push(callback(arg));
              }
            } catch (_error) {}
          }
          return _results;
        },
        song: [],
        playlist: [],
        playing: []
      };
    }

    Playlist.prototype.onChange = function(type, callback) {
      type = type.toLowerCase();
      if (type in this.event === false) {
        return null;
      }
      this.event[type].push(callback);
      return this;
    };

    Playlist.prototype.repeat = function(bool) {
      if (bool == null) {
        bool = null;
      }
      if (bool === null) {
        return this.repeatState;
      }
      if (typeof bool === 'boolean') {
        this.repeatState = bool;
      }
      return this;
    };

    Playlist.prototype.shuffle = function() {
      var lastSong;
      lastSong = this.getSong();
      this.songNumber = 0;
      resetSongs(this);
      this.songs.sort(function() {
        return (Math.floor(Math.random() * 3)) - 1;
      });
      if (lastSong !== this.getSong()) {
        this.event.fire('song', this);
      }
      this.event.fire('playlist', this);
      return this;
    };

    Playlist.prototype.play = function() {
      return this.after((function(_this) {
        return function() {
          var _ref;
          if ((_ref = _this.getSong()) != null) {
            _ref.play();
          }
          return _this;
        };
      })(this));
    };

    Playlist.prototype.pause = function() {
      var _ref;
      if ((_ref = this.getSong()) != null) {
        _ref.pause();
      }
      return this;
    };

    Playlist.prototype.next = function() {
      var lastSong, onLastSong;
      lastSong = this.songs.length - 1;
      onLastSong = this.songNumber === lastSong;
      if (onLastSong && this.repeat() === true) {
        return this.skipTo(0);
      }
      if (onLastSong && this.repeat() === false) {
        return void 0;
      } else if (this.songNumber < lastSong) {
        return this.skipTo(this.songNumber + 1);
      }
    };

    Playlist.prototype.previous = function() {
      var audio, currentTime;
      audio = this.getSong();
      if (audio.currentTime > 5) {
        currentTime = 0;
        return this;
      }
      if (this.songNumber === 0 && this.repeat() === true) {
        return this.skipTo(this.songs.length - 1);
      }
      if (this.songNumber > 0) {
        return this.skipTo(this.songNumber - 1);
      }
    };

    Playlist.prototype.skipTo = function(songNum) {
      if (((0 <= songNum && songNum < this.songs.length)) === false) {
        return;
      }
      if (songNum === void 0) {
        return;
      }
      resetSongs(this);
      this.songNumber = songNum;
      this.event.fire('song', this);
      return this;
    };

    Playlist.prototype.getSong = function(songNum) {
      if (!songNum) {
        return this.songs[this.songNumber];
      }
      if (songNum >= 0 && songNum < this.songs.length) {
        return this.songs[songNum];
      }
    };

    Playlist.prototype.album = function(audio) {
      var img, src;
      if (audio == null) {
        audio = this.getSong();
      }
      src = audio.getAttribute('data-img');
      if (src === null) {
        return;
      }
      img = document.createElement('img');
      img.src = src;
      return img;
    };

    Playlist.prototype.title = function(audio) {
      var songTitle;
      if (audio == null) {
        audio = this.getSong();
      }
      songTitle = audio.getAttribute('data-title');
      if (songTitle) {
        return songTitle;
      } else {
        return void 0;
      }
    };

    Playlist.prototype.add = function(data) {
      switch (data.constructor) {
        case String:
          return fetch.call(this, data);
        case Array:
          return dismantle.call(this, data);
        case Object:
          return this.add(Song.call(this, data));
      }
      if (data.tagName !== 'AUDIO') {
        return;
      }
      this.songs.push(data);
      this.event.fire('playlist', this);
      return this;
    };

    Playlist.prototype.remove = function(songNum) {
      if ((0 <= songNum && songNum < this.songs.length)) {
        try {
          this.songs[songNum].pause();
        } catch (_error) {}
        delete this.songs[songNum];
        this.songs = clean(this.songs);
        this.event.fire('playlist', this);
        if (this.songNumber === songNum) {
          this.songNumber = 0;
          this.event.fire('song', this);
        } else if (this.songNumber > songNum) {
          this.songNumber--;
        }
        return this;
      }
    };

    Playlist.prototype.after = function(callback) {
      new Callback((function(_this) {
        return function() {
          return callback(_this);
        };
      })(this)).when(this.songRequest, 'load');
      return this;
    };

    Playlist.prototype.each = function(callback) {
      var song, _i, _len, _ref;
      _ref = this.songs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        song = _ref[_i];
        try {
          callback(song, _i);
        } catch (_error) {}
      }
      return this;
    };

    Playlist.prototype.clear = function() {
      return this.after((function(_this) {
        return function() {
          return _this.each(function() {
            return _this.remove(0);
          });
        };
      })(this));
    };

    return Playlist;

  })();

  root.Playlist = Playlist;

}).call(this);
