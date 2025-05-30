// Parody Video Remix Generator core logic (minimal, for demo purposes)
document.getElementById('generate-btn').onclick = async function () {
  const videoInput = document.getElementById('video-upload').files[0];
  const youtubeUrl = document.getElementById('youtube-url').value;
  const remixStyle = document.getElementById('remix-style').value;
  const watermarkText = document.getElementById('watermark-text').value;
  const videoPreview = document.getElementById('video-preview');
  const canvas = document.getElementById('watermark-canvas');
  const downloadLink = document.getElementById('download-link');

  // Basic: Play uploaded video and overlay watermark (no real remixing in this static demo)
  if (videoInput) {
    const url = URL.createObjectURL(videoInput);
    videoPreview.src = url;
    videoPreview.style.display = "block";
    videoPreview.onloadedmetadata = () => {
      if (remixStyle === "watermark" || watermarkText) {
        applyWatermark(videoPreview, canvas, watermarkText);
      }
    };
    downloadLink.style.display = "none"; // No download in this demo
  } else if (youtubeUrl) {
    // Just show the YouTube video in an iframe (GitHub Pages can't download/process YouTube videos directly)
    videoPreview.style.display = "none";
    canvas.style.display = "none";
    document.getElementById('preview-section').innerHTML += `
      <iframe width="480" height="270" src="https://www.youtube.com/embed/${extractYoutubeID(youtubeUrl)}" frameborder="0" allowfullscreen></iframe>
    `;
  } else {
    alert("Please upload a video or provide a YouTube URL.");
  }
};

// Watermark overlay using Canvas
function applyWatermark(video, canvas, text) {
  canvas.style.display = "block";
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw video frame
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  // Draw watermark text
  ctx.font = "bold 30px Comic Sans MS";
  ctx.fillStyle = "#e74c3c";
  ctx.globalAlpha = 0.6;
  ctx.fillText(text, 30, canvas.height - 30);
  ctx.globalAlpha = 1.0;
}

// Extract YouTube video ID from URL
function extractYoutubeID(url) {
  const match = url.match(/(?:v=|\.be\/)([^&\n?#]+)/);
  return match ? match[1] : "";
}