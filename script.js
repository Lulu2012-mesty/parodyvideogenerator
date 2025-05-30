// Github Pages Parody Video Remixer/Exporter
const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

const videoInput = document.getElementById('videoInput');
const watermarkText = document.getElementById('watermarkText');
const remixBtn = document.getElementById('remixBtn');
const exportBtn = document.getElementById('exportBtn');
const updateBtn = document.getElementById('updateBtn');
const autofixBtn = document.getElementById('autofixBtn');
const videoPreview = document.getElementById('videoPreview');
const canvasPreview = document.getElementById('canvasPreview');
const downloadLink = document.getElementById('downloadLink');
const status = document.getElementById('status');

let uploadedFile;
let remixed = false;

videoInput.addEventListener('change', (e) => {
  uploadedFile = e.target.files[0];
  const url = URL.createObjectURL(uploadedFile);
  videoPreview.src = url;
  videoPreview.style.display = 'block';
  status.textContent = 'Video loaded.';
});

remixBtn.onclick = async () => {
  if (!uploadedFile) {
    status.textContent = 'Please upload a video first.';
    return;
  }
  status.textContent = 'Remixing...';
  // Draw one frame with watermark as parody effect (extend with real remix logic)
  videoPreview.pause();
  canvasPreview.style.display = 'block';
  canvasPreview.width = videoPreview.videoWidth || 480;
  canvasPreview.height = videoPreview.videoHeight || 270;
  const ctx = canvasPreview.getContext('2d');
  ctx.drawImage(videoPreview, 0, 0, canvasPreview.width, canvasPreview.height);
  if (watermarkText.value) {
    ctx.font = 'bold 32px Comic Sans MS';
    ctx.fillStyle = '#e74c3c';
    ctx.globalAlpha = 0.7;
    ctx.fillText(watermarkText.value, 30, canvasPreview.height - 40);
    ctx.globalAlpha = 1.0;
  }
  status.textContent = 'Remix preview complete!';
  remixed = true;
};

exportBtn.onclick = async () => {
  if (!uploadedFile) {
    status.textContent = 'Upload and remix a video first!';
    return;
  }
  status.textContent = 'Exporting with ffmpeg (this may take a moment)...';
  if (!ffmpeg.isLoaded()) await ffmpeg.load();
  ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(uploadedFile));
  // Example: add watermark as drawtext (extend with real logic as needed)
  const text = watermarkText.value || 'Parody!';
  await ffmpeg.run(
    '-i', 'input.mp4',
    '-vf', `drawtext=text='${text}':fontcolor=white:fontsize=30:x=10:y=H-th-10`,
    '-c:a', 'copy', 'output.mp4'
  );
  const data = ffmpeg.FS('readFile', 'output.mp4');
  const url = URL.createObjectURL(
    new Blob([data.buffer], { type: 'video/mp4' })
  );
  downloadLink.href = url;
  downloadLink.style.display = 'inline-block';
  status.textContent = 'Export complete! Download ready.';
};

autofixBtn.onclick = () => {
  // Example autofix logic: reset fields and clear errors
  videoInput.value = '';
  watermarkText.value = '';
  videoPreview.src = '';
  canvasPreview.style.display = 'none';
  downloadLink.style.display = 'none';
  status.textContent = 'Autofix applied: fields reset.';
  remixed = false;
};

updateBtn.onclick = () => {
  // Example update logic: reload page (could auto-update UI or code in a real app)
  status.textContent = 'Updating...';
  setTimeout(() => {
    window.location.reload();
  }, 1000);
};