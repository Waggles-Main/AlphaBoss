document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // CONFIGURATION
    // =========================================================================
    const showcase = document.getElementById('showcase');
    const NUM_CARDS = 5;
    const GLYPH_IMAGES = [
        'images/glyphs/big-a.png',
        'images/glyphs/big-e.png',
        'images/glyphs/big-i.png',
        'images/glyphs/big-o.png',
        'images/glyphs/big-u.png',
    ];
    const MAX_ROTATION = 25;       // How far the tile tilts with mouse movement
    const HOVER_SCALE = 1.1;         // How much it enlarges on hover
    const SPRING_STIFFNESS = 0.12;   // Higher is stiffer/snappier
    const DAMPING = 0.8;             // Lower is more bouncy

    // =========================================================================
    // INITIALIZATION
    // =========================================================================

    // An array to hold references to all the scene elements we create
    const scenes = [];

    // --- Dynamically create the cards ---
    for (let i = 0; i < NUM_CARDS; i++) {
        const scene = createCard(i);
        showcase.appendChild(scene);
        scenes.push(scene);

        // --- Animation State for this card ---
        // We attach the state directly to the DOM element for easy access in the animation loop
        scene.animationState = {
            targetRotX: 0, targetRotY: 0, targetScale: 1,
            currentRotX: 0, currentRotY: 0, currentScale: 1,
            velocityX: 0, velocityY: 0, velocityScale: 0,
        };

        // --- Event Listeners for this card ---
        const glyphContainer = scene.querySelector('.glyph-container');
        scene.addEventListener('mouseenter', () => {
            scene.animationState.targetScale = HOVER_SCALE;
            glyphContainer.classList.add('highlight');
            createRainbowBurst(scene);
        });

        scene.addEventListener('mousemove', e => {
            const rect = scene.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const normX = x / (rect.width / 2);
            const normY = y / (rect.height / 2);
            scene.animationState.targetRotY = normX * MAX_ROTATION;
            scene.animationState.targetRotX = -normY * MAX_ROTATION;
        });

        scene.addEventListener('mouseleave', () => {
            scene.animationState.targetRotX = 0; // Return to straight-on
            scene.animationState.targetRotY = 0; // Return to straight-on
            scene.animationState.targetScale = 1; // Return to normal scale
            glyphContainer.classList.remove('highlight');
            createDustPoof(scene);
        });
    }

    // =========================================================================
    // ANIMATION LOOP
    // =========================================================================
    function animate() {
        scenes.forEach(scene => {
            const state = scene.animationState;
            const glyphContainer = scene.querySelector('.glyph-container');

            // Calculate the "force" of the spring based on distance to target
            const dx = state.targetRotX - state.currentRotX;
            const dy = state.targetRotY - state.currentRotY;
            const ds = state.targetScale - state.currentScale;

            // Update velocity with the spring force
            state.velocityX += dx * SPRING_STIFFNESS;
            state.velocityY += dy * SPRING_STIFFNESS;
            state.velocityScale += ds * SPRING_STIFFNESS;

            // Apply damping (friction) to slow the animation down
            state.velocityX *= DAMPING;
            state.velocityY *= DAMPING;
            state.velocityScale *= DAMPING;

            // Update the current position/scale with the velocity
            state.currentRotX += state.velocityX;
            state.currentRotY += state.velocityY;
            state.currentScale += state.velocityScale;

            // Apply the final transform to the DOM element
            glyphContainer.style.transform = `rotateX(${state.currentRotX}deg) rotateY(${state.currentRotY}deg) scale3d(${state.currentScale}, ${state.currentScale}, 1)`;
        });

        // Continue the loop on the next frame
        requestAnimationFrame(animate);
    }

    // Start the animation loop
    animate();

    // =========================================================================
    // HELPER FUNCTIONS
    // =========================================================================

    /**
     * Creates the DOM structure for a single 3D glyph card.
     * @param {number} index - The index of the card, used to pick an image.
     * @returns {HTMLElement} The created .scene element.
     */
    function createCard(index) {
        const scene = document.createElement('div');
        scene.className = 'scene';

        const glyphContainer = document.createElement('div');
        glyphContainer.className = 'glyph-container';

        // Create the outline shell
        const outline = document.createElement('div');
        outline.className = 'mahjong-glyph outline';
        outline.innerHTML = '<div class="face front"></div>';

        // Create the main glyph with all its faces
        const main = document.createElement('div');
        main.className = 'mahjong-glyph main';
        const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
        main.innerHTML = faces.map(face => `<div class="face ${face}"></div>`).join('');
        main.querySelector('.face.front').style.backgroundImage = `url('${GLYPH_IMAGES[index % GLYPH_IMAGES.length]}')`;

        glyphContainer.append(outline, main);
        scene.appendChild(glyphContainer);
        return scene;
    }

    /**
     * Creates a puff of dust particles around an element.
     * @param {HTMLElement} originElement - The element to emit particles from.
     */
    function createDustPoof(originElement) {
        const rect = originElement.getBoundingClientRect();
        const particleCount = 20; // How many particles to create

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'dust-particle';

            let startX, startY, destX, destY;
            const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left

            switch (edge) {
                case 0: // Top edge
                    startX = rect.left + Math.random() * rect.width;
                    startY = rect.top;
                    destX = (Math.random() - 0.5) * 60;
                    destY = Math.random() * -30 - 10; // Move up
                    break;
                case 1: // Right edge
                    startX = rect.right;
                    startY = rect.top + Math.random() * rect.height;
                    destX = Math.random() * 30 + 10; // Move right
                    destY = (Math.random() - 0.5) * 60;
                    break;
                case 2: // Bottom edge
                    startX = rect.left + Math.random() * rect.width;
                    startY = rect.bottom;
                    destX = (Math.random() - 0.5) * 60;
                    destY = Math.random() * 30 + 10; // Move down
                    break;
                case 3: // Left edge
                    startX = rect.left;
                    startY = rect.top + Math.random() * rect.height;
                    destX = Math.random() * -30 - 10; // Move left
                    destY = (Math.random() - 0.5) * 60;
                    break;
            }

            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;

            // Randomize properties for each particle
            const size = Math.random() * 5 + 1; // Size between 1px and 6px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            const scale = Math.random() * 1.5 + 0.5; // Final scale

            particle.style.setProperty('--x', `${destX}px`);
            particle.style.setProperty('--y', `${destY}px`);
            particle.style.setProperty('--s', scale);

            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 600); // Cleanup after animation
        }
    }

    /**
     * Creates a burst of rainbow particles from the contour of an element.
     * @param {HTMLElement} originElement - The element to emit particles from.
     */
    function createRainbowBurst(originElement) {
        const rect = originElement.getBoundingClientRect();
        const particleCount = 30; // More particles for a bigger burst
        const colors = ['#ff5f4f', '#fd8c1f', '#ffd700', '#56a67a', '#1f8df2', '#7a73bb'];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'rainbow-particle';

            let startX, startY, destX, destY, startRotation;
            const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
            const distance = 80 + Math.random() * 50; // How far they fly out

            switch (edge) {
                case 0: // Top edge
                    startX = rect.left + Math.random() * rect.width;
                    startY = rect.top;
                    destX = (Math.random() - 0.5) * 80;
                    destY = -distance;
                    startRotation = 0;
                    break;
                case 1: // Right edge
                    startX = rect.right;
                    startY = rect.top + Math.random() * rect.height;
                    destX = distance;
                    destY = (Math.random() - 0.5) * 80;
                    startRotation = 90;
                    break;
                case 2: // Bottom edge
                    startX = rect.left + Math.random() * rect.width;
                    startY = rect.bottom;
                    destX = (Math.random() - 0.5) * 80;
                    destY = distance;
                    startRotation = 180;
                    break;
                case 3: // Left edge
                    startX = rect.left;
                    startY = rect.top + Math.random() * rect.height;
                    destX = -distance;
                    destY = (Math.random() - 0.5) * 80;
                    startRotation = -90;
                    break;
            }

            // --- Particle Style ---
            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;
            particle.style.backgroundColor = colors[i % colors.length];
            particle.style.width = `${4 + Math.random() * 4}px`; // Chunky lines
            particle.style.height = `${20 + Math.random() * 20}px`;

            // --- Animation Properties ---
            const endRotation = startRotation + (Math.random() - 0.5) * 90;

            // Set CSS variables for the keyframe animation
            particle.style.setProperty('--x-start', `-50%`);
            particle.style.setProperty('--y-start', `-50%`);
            particle.style.setProperty('--x-end', `calc(-50% + ${destX}px)`); // Use relative destination
            particle.style.setProperty('--y-end', `calc(-50% + ${destY}px)`); // Use relative destination
            particle.style.setProperty('--r-start', `${startRotation}deg`);
            particle.style.setProperty('--r-end', `${endRotation}deg`);

            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 500); // Cleanup after animation
        }
    }
});