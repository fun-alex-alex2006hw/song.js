// Generated by CoffeeScript 1.7.1
(function() {
  'use strict';
  var clean, fireSongEvent, makeAudio, root;

  root = this;

  makeAudio = function(title, src, img) {
    var aud;
    aud = document.createElement('audio');
    if (title) {
      aud.setAttribute('data-title', title);
    }
    if (src) {
      aud.setAttribute('src', src);
    }
    if (img) {
      aud.setAttribute('data-img', img);
    }
    return aud;
  };

  fireSongEvent = function(instance) {
    try {
      return instance.callbacks.forEach(function(callback) {
        return callback(instance.getSong());
      });
    } catch (_error) {}
  };

  clean = function(playlist) {
    var song, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = playlist.length; _i < _len; _i++) {
      song = playlist[_i];
      if (song) {
        _results.push(song);
      }
    }
    return _results;
  };

  root.Song = function(playlist) {
    this.repeat = false;
    this.playlist = [];
    this.add(playlist);
    this.songNumber = 0;
    this.callbacks = [];
    return this;
  };

  root.Song.prototype = {
    constructor: root.Song,
    history: [],
    songChange: function(callback) {
      return this.callbacks.push(callback);
    },
    updateHistory: function(song) {
      var history, last;
      history = root.Song.prototype.history;
      last = history.length - 1;
      if (song === history[last]) {
        return void 0;
      } else {
        return history.push(song);
      }
    },
    shuffle: function() {
      this.songNumber = 0;
      this.playlist.sort(function() {
        return (Math.floor(Math.random() * 3)) - 1;
      });
      this.resetSongs();
      fireSongEvent(this);
      return this.playlist;
    },
    next: function() {
      var isLastSong, lastSong, repeat;
      lastSong = this.playlist.length - 1;
      isLastSong = this.songNumber === lastSong;
      repeat = this.repeat;
      if (isLastSong && repeat) {
        return this.skipTo(0);
      } else if (isLastSong && !repeat) {
        return void 0;
      } else if (this.songNumber < lastSong) {
        return this.skipTo(this.songNumber + 1);
      }
    },
    previous: function() {
      var audio;
      audio = this.getSong();
      if (audio.currentTime < 5 && audio.currentTime > 0) {
        this.resetSongs();
        return audio;
      } else if (this.songNumber === 0 && this.repeat) {
        return this.skipTo(this.playlist.length - 1);
      } else if (this.songNumber > 0) {
        return this.skipTo(this.songNumber - 1);
      }
    },
    skipTo: function(songNum) {
      if (songNum >= this.playlist.length) {
        return void 0;
      }
      if (songNum < 0) {
        return void 0;
      }
      if (songNum || songNum === 0) {
        this.resetSongs;
        this.songNumber = songNum;
        this.updateHistory(this.getSong());
        fireSongEvent(this);
        return this.getSong();
      }
    },
    resetSongs: function() {
      var song, _i, _len, _ref, _results;
      _ref = this.playlist;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        song = _ref[_i];
        try {
          song.pause();
          _results.push(song.currentTime = 0);
        } catch (_error) {}
      }
      return _results;
    },
    getSong: function() {
      return this.playlist[this.songNumber];
    },
    getAlbum: function(audio) {
      var img, src;
      if (!audio) {
        audio = this.getSong();
      }
      src = audio.getAttribute('data-img');
      img = document.createElement('img');
      img.src = src;
      return img;
    },
    getTitle: function(audio) {
      var title;
      if (!audio) {
        audio = this.getSong();
      }
      try {
        title = audio.getAttribute('data-title');
      } catch (_error) {
        title = '';
      }
      return title;
    },
    add: function(playlist) {
      var audioTag, song, _i, _len;
      if (!playlist) {
        return void 0;
      }
      if (playlist.length > 0 && typeof playlist === 'object') {
        for (_i = 0, _len = playlist.length; _i < _len; _i++) {
          song = playlist[_i];
          audioTag = makeAudio(song.title, song.src, song.img);
          this.playlist.push(audioTag);
        }
        return this.playlist;
      } else if (typeof playlist === 'object') {
        audioTag = makeAudio(playlist.title, playlist.src, playlist.img);
        this.playlist.push(audioTag);
        fireSongEvent(this);
        return this.playlist;
      }
    },
    remove: function(songNum) {
      if (songNum >= 0 && songNum < this.playlist.length) {
        delete this.playlist[songNum];
        this.playlist = clean(this.playlist);
        fireSongEvent(this);
        if (this.songNumber === songNum) {
          this.songNumber = 0;
        } else if (this.songNumber > songNum) {
          this.songNumber--;
        }
        return this.playlist;
      }
    }
  };

}).call(this);
