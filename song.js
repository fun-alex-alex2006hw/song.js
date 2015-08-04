// Generated by CoffeeScript 1.7.1
(function() {
  'use strict';
  var Playlist, clean, fireEvent, getSongs, makeAudio, resetSongs, root, songRequest;

  try {
    new Audio();
  } catch (_error) {
    return this.Playlist = void 0;
  }

  root = this;

  songRequest = null;

  getSongs = function(url, playlist) {
    var request;
    request = new XMLHttpRequest();
    request.open('get', url, true);
    request.addEventListener('load', function() {
      var songs;
      songs = JSON.parse(request.responseText);
      playlist.add(songs);
      return songRequest = null;
    });
    request.send();
    songRequest = request;
    return playlist;
  };

  makeAudio = function(song) {
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
    return audio;
  };

  fireEvent = function(playlist, callbacks) {
    var callback, _i, _len, _results;
    try {
      _results = [];
      for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
        callback = callbacks[_i];
        _results.push(callback(playlist.getSong()));
      }
      return _results;
    } catch (_error) {}
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

  resetSongs = function(playlist) {
    var song, _i, _len;
    playlist = playlist.songs;
    for (_i = 0, _len = playlist.length; _i < _len; _i++) {
      song = playlist[_i];
      try {
        song.pause();
        song.currentTime = 0;
      } catch (_error) {}
    }
    return playlist;
  };

  Playlist = (function() {
    function Playlist(name) {
      this.name = name;
      this.songs = [];
      this.songNumber = 0;
      this.songCallbacks = [];
      this.playlistCallbacks = [];
      this.repeat = (function() {
        var repeatState;
        repeatState = false;
        return function(bool) {
          if (bool === void 0) {
            return repeatState;
          }
          if (typeof bool === 'boolean') {
            repeatState = bool;
          }
          return this;
        };
      })();
    }

    Playlist.prototype.onChange = function(type, callback) {
      if (type.toLowerCase() === 'song') {
        this.songCallbacks.push(callback);
      } else if (type.toLowerCase() === 'playlist') {
        this.playlistCallbacks.push(callback);
      }
      return this;
    };

    Playlist.prototype.shuffle = function() {
      this.songNumber = 0;
      this.songs.sort(function() {
        return (Math.floor(Math.random() * 3)) - 1;
      });
      resetSongs(this);
      fireEvent(this, this.playlistCallbacks);
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
      var audio;
      audio = this.getSong();
      if (audio.currentTime > 5) {
        resetSongs(this);
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
      fireEvent(this, this.songCallbacks);
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
      var song, _i, _len;
      if (typeof data === 'string') {
        return getSongs(data, this);
      }
      if (data.length > 0) {
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          song = data[_i];
          this.songs.push(makeAudio(song));
        }
      } else if (data.tagName === 'AUDIO') {
        this.songs.push(data);
      } else if (typeof data === 'object') {
        this.songs.push(makeAudio(data));
      }
      fireEvent(this, this.playlistCallbacks);
      return this;
    };

    Playlist.prototype.after = function(callback) {
      if (songRequest !== null) {
        songRequest.addEventListener('load', (function(_this) {
          return function() {
            return callback(_this);
          };
        })(this));
      } else {
        callback(this);
      }
      return this;
    };

    Playlist.prototype.remove = function(songNum) {
      if ((0 <= songNum && songNum < this.songs.length)) {
        try {
          this.songs[songNum].pause();
        } catch (_error) {}
        delete this.songs[songNum];
        this.songs = clean(this.songs);
        fireEvent(this, this.playlistCallbacks);
        if (this.songNumber === songNum) {
          this.songNumber = 0;
          fireEvent(this.songs, this.songCallbacks);
        } else if (this.songNumber > songNum) {
          this.songNumber--;
        }
        return this;
      }
    };

    Playlist.prototype.each = function(callback) {
      var song, _i, _len, _ref;
      try {
        _ref = this.songs;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          song = _ref[_i];
          callback(song, _i);
        }
      } catch (_error) {}
      return this;
    };

    return Playlist;

  })();

  root.Playlist = Playlist;

}).call(this);
