const canvas = document.getElementById('video-canvas');
const ctx = canvas.getContext('2d');

const frameCount = 176;
const images = [];

// Helper to get image path based on frame index
const currentFrame = index => (
    `./frames/frame_${index.toString().padStart(6, '0')}.png`
);

// Preload frames
for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
}

// Ensure the canvas stretches correctly while maintaining aspect ratio
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render(0);
}

function render(index) {
    if (images[index] && images[index].complete) {
        const img = images[index];
        // Calculate scale to cover canvas (like object-fit: cover)
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio  = Math.max(hRatio, vRatio);
        
        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;  
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, img.width, img.height, 
                      centerShift_x, centerShift_y, 
                      img.width * ratio, img.height * ratio);  
    }
}

// Initial resize setup
window.addEventListener('resize', resizeCanvas);

// Render the first frame once loaded
images[0].onload = resizeCanvas;

// Update frame on scroll
window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
    
    // Calculate scroll progress (0 to 1)
    const scrollFraction = scrollTop / maxScrollTop;
    
    // Calculate current frame
    const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
    );
    
    requestAnimationFrame(() => render(frameIndex));
});

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const sidebar = document.querySelector('.sidebar');

if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}
