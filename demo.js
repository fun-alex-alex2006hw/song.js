// Generated by CoffeeScript 1.7.1
(function() {
  var sampleData, song;

  sampleData = [
    {
      src: 'http://datashat.net/music_for_programming_1-datassette.mp3',
      img: 'album/song1.png',
      title: 'Song #1'
    }, {
      src: 'http://datashat.net/music_for_programming_2-sunjammer.mp3',
      img: 'album/song2.png',
      title: 'Song #2'
    }, {
      src: 'http://datashat.net/music_for_programming_3-datassette.mp3',
      img: 'album/song3.png',
      title: 'Song #3'
    }, {
      src: 'http://datashat.net/music_for_programming_4-com_truise.mp3',
      img: 'album/song4.png',
      title: 'Song #4'
    }
  ];

  song = new Song(sampleData);

  song.repeat = true;

  song.shuffle();

  window.onload = function() {
    var makeTag, next, pause, play, previous, shuffle;
    makeTag = function(tag) {
      return document.createElement(tag);
    };
    (function() {
      var nowPlaying, setNowPlaying;
      nowPlaying = document.getElementById('now-playing');
      setNowPlaying = function() {
        var art, title;
        title = makeTag('p');
        title.innerHTML = song.getTitle();
        title.innerHTML += '<br>';
        art = song.getAlbum();
        nowPlaying.innerHTML = '';
        nowPlaying.appendChild(title);
        return nowPlaying.appendChild(art);
      };
      song.songChange.push(setNowPlaying);
      return setNowPlaying();
    })();
    (function() {
      var playlist, skipToSong;
      skipToSong = function(songNum) {
        return song.skipTo(songNum);
      };
      playlist = document.getElementById('playlist');
      return song.playlist.forEach(function(tag, index) {
        var div, h2;
        div = makeTag('div');
        div.className = 'playlist';
        h2 = makeTag('h2');
        h2.innerHTML = song.getTitle(tag);
        div.appendChild(h2);
        playlist.appendChild(div);
        return div.addEventListener('click', function() {
          return skipToSong(index);
        });
      });
    })();
    pause = document.getElementById('pause');
    play = document.getElementById('play');
    next = document.getElementById('next');
    previous = document.getElementById('previous');
    shuffle = document.getElementById('shuffle');
    pause.onclick = function() {
      return song.getSong().pause();
    };
    play.onclick = function() {
      return song.getSong().play();
    };
    next.onclick = function() {
      return song.getSong().next().play();
    };
    previous.onclick = function() {
      return song.getSong().previous().play();
    };
    return shuffle.onclick = function() {
      return song.shuffle()[0].play();
    };
  };

}).call(this);
