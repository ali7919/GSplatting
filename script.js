// Wait for the GSplat library to be loaded
window.onload = async function() {
    // Make sure GSplat is loaded
    if (typeof GSplat === 'undefined') {
        console.error("GSplat library not loaded!");
        document.getElementById('info').innerHTML = '<h1>Error</h1><p>Failed to load GSplat library</p>';
        return;
    }

    const canvas = document.getElementById('canvas');
    const progressElement = document.getElementById('loading-progress');
    const infoElement = document.getElementById('info');
    
    // Initialize the renderer
    const renderer = new GSplat.WebGLRenderer(canvas);
    const scene = new GSplat.Scene();
    const camera = new GSplat.Camera();
    const controls = new GSplat.OrbitControls(camera, canvas);

    // Set up camera
    camera.position.z = 3;
    
    // URL to the Nike splat file
    const splatUrl = "https://huggingface.co/cakewalk/splat-data/resolve/main/nike.splat";
    
    try {
        // Display loading status
        progressElement.textContent = 'Loading...';
        
        // Load the splat
        const loader = new GSplat.SplatLoader();
        
        // Add progress tracking
        loader.addEventListener('progress', (e) => {
            const percent = Math.round(e.loaded / e.total * 100);
            progressElement.textContent = `${percent}%`;
        });
        
        // Load the gaussian splat
        const splat = await loader.loadAsync(splatUrl);
        scene.add(splat);
        
        // Hide loading info after successful load
        setTimeout(() => {
            infoElement.style.opacity = "0";
            setTimeout(() => {
                infoElement.style.display = "none";
            }, 500);
        }, 1000);
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        
        // Start the animation loop
        animate();
        
        // Add event to show/hide info on click
        canvas.addEventListener('click', () => {
            if (infoElement.style.display === "none") {
                infoElement.style.display = "block";
                setTimeout(() => {
                    infoElement.style.opacity = "1";
                }, 0);
            } else {
                infoElement.style.opacity = "0";
                setTimeout(() => {
                    infoElement.style.display = "none";
                }, 500);
            }
        });
        
    } catch (error) {
        console.error("Error loading the splat:", error);
        infoElement.innerHTML = `<h1>Error</h1><p>Failed to load the splat: ${error.message}</p>`;
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Initial size setup
    renderer.setSize(window.innerWidth, window.innerHeight);
};