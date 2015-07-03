// Generated by CoffeeScript 1.9.3
(function() {
  'use strict';
  var add, makeAudio, root;

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

  add = function(playlist, destination) {
    var audio, i, len, song;
    if (playlist.length === 0) {
      return void 0;
    }
    for (i = 0, len = playlist.length; i < len; i++) {
      song = playlist[i];
      audio = makeAudio(song.title, song.src, song.img);
      destination.push(aud);
    }
    return destination;
  };

  root.Song = function(playlist) {
    this.repeat = false;
    this.playlist = [];
    add(playlist, this.playlist);
    this.songNumber = 0;
    return this.onsongchange;
  };

  root.Song.prototype.history = [];

  root.Song.prototype.updateHistory = function(song) {
    var history, last;
    history = root.Song.prototype.history;
    last = history.length - 1;
    if (song === history[last]) {
      return void 0;
    } else {
      return history.push(song);
    }
  };

  root.Song.prototype.shuffle = function() {
    this.songNumber = 0;
    this.playlist.sort(function() {
      return (Math.floor(Math.random() * 3)) - 1;
    });
    this.resetSongs();
    try {
      this.onsongchange();
    } catch (_error) {}
    return this.playlist;
  };

}).call(this);
