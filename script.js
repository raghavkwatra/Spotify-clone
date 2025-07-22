// script.js

// ----------------------
// SAMPLE SONG DATA
// ----------------------
const songs = [
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    src: "songs/Blinding Lights .mp3",
    cover: "covers/blinding-lights.jpg",
  },
  {
    title: "Levitating",
    artist: "Dua Lipa",
    src: "songs/Levitating.mp3",
    cover: "covers/levitating.jpg",
  },
  {
    title: "Shape of You",
    artist: "Ed Sheeran",
    src: "songs/Shape Of You - (Raag.Fm).mp3",
    cover: "covers/shape-of-you.jpg",
  },
];
const popularArtists = [
  {
    name: "The Weeknd",
    image: "artists/the-weeknd.jpg",
    followers: "25M",
  },
  {
    name: "Dua Lipa",
    image: "artists/dua-lipa.jpg",
    followers: "20M",
  },
  {
    name: "Ed Sheeran",
    image: "artists/ed-sheeran.jpg",
    followers: "22M",
  },
  {
    name: "Taylor Swift",
    image: "artists/taylor-swift.jpg",
    followers: "30M",
  },
];

// ----------------------
// GLOBAL VARIABLES
// ----------------------

let currentIndex = 0;
const audio = document.getElementById("audioPlayer");
const masterPlay = document.getElementById("masterPlay");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const progressFill = document.getElementById("progressFill");
const progressContainer = document.getElementById("progressContainer");
const currentTitle = document.getElementById("currentTitle");
const currentArtist = document.getElementById("currentArtist");
const currentCover = document.getElementById("currentCover");
const backgroundImage = document.getElementById("backgroundImage");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");
const volumeBar = document.getElementById("volumeBar");
const volumeFill = document.getElementById("volumeFill");
const volumeHandle = document.getElementById("volumeHandle");
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const toastContainer = document.getElementById("toastContainer");
const loadingOverlay = document.getElementById("loadingOverlay");
const queueModal = document.getElementById("queueModal");
const closeQueueModal = document.getElementById("closeQueueModal");
const createPlaylistModal = document.getElementById("createPlaylistModal");
const closePlaylistModal = document.getElementById("closePlaylistModal");
const cancelPlaylist = document.getElementById("cancelPlaylist");
const createPlaylistBtn = document.getElementById("createPlaylistBtn");
const savePlaylist = document.getElementById("savePlaylist");

// ----------------------
// AUDIO CONTROL
// ----------------------
function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  currentTitle.textContent = song.title;
  currentArtist.textContent = song.artist;
  currentCover.style.backgroundImage = `url(${song.cover})`;
  audio.load();
}

function playSong() {
  audio.play();
  masterPlay.innerHTML = '<i class="fas fa-pause"></i>';
}

function pauseSong() {
  audio.pause();
  masterPlay.innerHTML = '<i class="fas fa-play"></i>';
}

function togglePlay() {
  audio.paused ? playSong() : pauseSong();
}

function nextSong() {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
  playSong();
}

function prevSong() {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  playSong();
}

function formatTime(sec) {
  const mins = Math.floor(sec / 60);
  const secs = Math.floor(sec % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

audio.addEventListener("timeupdate", () => {
  const { currentTime, duration } = audio;
  if (duration) {
    progressFill.style.width = `${(currentTime / duration) * 100}%`;
    currentTimeEl.textContent = formatTime(currentTime);
    totalTimeEl.textContent = formatTime(duration);
  }
});

progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  if (!isNaN(duration)) {
    audio.currentTime = (clickX / width) * duration;
  }
});

masterPlay.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

audio.volume = 0.7;
volumeFill.style.width = "70%";
volumeHandle.style.left = "70%";

volumeBar.addEventListener("click", (e) => {
  const width = volumeBar.clientWidth;
  const clickX = e.offsetX;
  const percent = clickX / width;
  audio.volume = percent;
  volumeFill.style.width = `${percent * 100}%`;
  volumeHandle.style.left = `${percent * 100}%`;
});

// ----------------------
// SEARCH
// ----------------------
clearSearch.addEventListener("click", () => {
  searchInput.value = "";
});

// ----------------------
// LOADING OVERLAY
// ----------------------
function showLoading() {
  loadingOverlay.classList.add("active");
  setTimeout(() => loadingOverlay.classList.remove("active"), 1500);
}

// ----------------------
// TOAST NOTIFICATION
// ----------------------
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ----------------------
// MODAL CONTROLS
// ----------------------
closeQueueModal.addEventListener("click", () => {
  queueModal.classList.remove("active");
});

closePlaylistModal.addEventListener("click", () => {
  createPlaylistModal.classList.remove("active");
});

cancelPlaylist.addEventListener("click", () => {
  createPlaylistModal.classList.remove("active");
});

createPlaylistBtn.addEventListener("click", () => {
  createPlaylistModal.classList.add("active");
});

savePlaylist.addEventListener("click", () => {
  const name = document.getElementById("playlistNameInput").value;
  const desc = document.getElementById("playlistDescInput").value;
  if (name.trim()) {
    showToast(`Playlist "${name}" created.`);
    createPlaylistModal.classList.remove("active");
  } else {
    showToast("Please enter a name for your playlist.");
  }
});

// ----------------------
// INITIALIZE
// ----------------------
document.addEventListener("DOMContentLoaded", () => {
  loadSong(currentIndex);
  showLoading();
});

// Target the container
const songsListEl = document.getElementById("songsList");

// Function to populate featured tracks
function populateFeaturedTracks() {
  songsListEl.innerHTML = "";
  songs.forEach((song, index) => {
    const songItem = document.createElement("div");
    songItem.className = "song-item";
    songItem.innerHTML = `
      <div class="song-cover" style="background-image: url('${song.cover}')"></div>
      <div class="song-info">
        <div class="song-name">${song.title}</div>
        <div class="song-artist">${song.artist}</div>
      </div>
      <div class="song-controls">
        <button class="play-btn" data-index="${index}">
          <i class="fas fa-play"></i>
        </button>
      </div>
    `;
    songsListEl.appendChild(songItem);
  });

  // Play song on button click
  document.querySelectorAll(".play-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = parseInt(e.currentTarget.getAttribute("data-index"));
      loadSong(index);
      playSong();
    });
  });
}

// Sample load and play functions

function loadSong(index) {
  const song = songs[index];
  currentIndex = index;
  audio.src = song.src;
  document.getElementById("currentTitle").textContent = song.title;
  document.getElementById("currentArtist").textContent = song.artist;
  document.getElementById(
    "currentCover"
  ).style.backgroundImage = `url(${song.cover})`;
  audio.load();
}

function playSong() {
  audio.play();
  document.getElementById(
    "masterPlay"
  ).innerHTML = `<i class="fas fa-pause"></i>`;
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  populateFeaturedTracks();
});
const recentlyPlayedEl = document.getElementById("recentlyPlayed");

function populateRecentlyPlayed() {
  recentlyPlayedEl.innerHTML = "";
  songs.forEach((song, index) => {
    const item = document.createElement("div");
    item.className = "recent-item";
    item.innerHTML = `
      <div class="cover" style="background-image: url('${song.cover}'); height: 150px; border-radius: 10px; background-size: cover;"></div>
      <h4 style="margin-top: 0.75rem;">${song.title}</h4>
      <p style="color: #b3b3b3; font-size: 0.9rem;">${song.artist}</p>
    `;
    item.addEventListener("click", () => {
      audio.src = song.src;
      audio.load();
      document.getElementById("currentTitle").textContent = song.title;
      document.getElementById("currentArtist").textContent = song.artist;
      document.getElementById(
        "currentCover"
      ).style.backgroundImage = `url(${song.cover})`;
      playSong();
    });
    recentlyPlayedEl.appendChild(item);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  populateRecentlyPlayed();
});

// Target the container for popular artists

const artistsListEl = document.getElementById("artistsList");

function populatePopularArtists() {
  artistsListEl.innerHTML = "";
  popularArtists.forEach((artist) => {
    const card = document.createElement("div");
    card.className = "artist-card";
    card.innerHTML = `
      <div class="artist-avatar" style="background-image: url('${artist.image}'); background-size: cover; background-position: center;"></div>
      <div class="artist-name">${artist.name}</div>
      <div class="artist-followers">${artist.followers} Followers</div>
    `;
    artistsListEl.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  populatePopularArtists();
});
