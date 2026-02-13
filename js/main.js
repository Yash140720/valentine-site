document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Audio Toggle Logic ---
    const soundBtn = document.getElementById('sound-btn');
    const bgMusic = document.getElementById('bg-music');
    let isPlaying = false;

    soundBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            soundBtn.innerHTML = '🔇';
            isPlaying = false;
        } else {
            bgMusic.play().catch(() => { });
            soundBtn.innerHTML = '🔊';
            isPlaying = true;
        }
    });

    // --- 1.2 Play on First Interaction ---
    const startMusic = () => {
        if (!isPlaying) {
            bgMusic.play().then(() => {
                isPlaying = true;
                soundBtn.innerHTML = '🔊';
                document.removeEventListener('click', startMusic);
                document.removeEventListener('touchstart', startMusic);
            }).catch(() => { });
        }
    };
    document.addEventListener('click', startMusic);
    document.addEventListener('touchstart', startMusic);

    // --- 1.3 Stop at Map Section ---
    const mapSection = document.getElementById('distance-map');
    if (mapSection) {
        const musicStopObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && isPlaying) {
                    bgMusic.pause();
                    isPlaying = false;
                    soundBtn.innerHTML = '🔇';
                }
            });
        }, { threshold: 0.1 });
        musicStopObserver.observe(mapSection);
    }

    // --- 1.4 Begin Our Journey Scroll & Play ---
    const journeyBtn = document.getElementById('enter-journey-btn');
    if (journeyBtn) {
        journeyBtn.addEventListener('click', () => {
            startMusic();
            const nextSection = document.getElementById('timeline-section');
            if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- 1.5 Her Heart Audio Auto-Play (Intersection Observer) ---
    const herHeartSection = document.getElementById('her-heart');
    const herHeartVideo = document.querySelector('#her-heart video');

    if (herHeartSection && herHeartVideo) {
        // Hidden Interaction: Tap anywhere on the section to toggle sound (Backup)
        herHeartSection.addEventListener('click', () => {
            herHeartVideo.muted = !herHeartVideo.muted;
            if (!herHeartVideo.muted) {
                herHeartVideo.volume = 1.0;
                herHeartVideo.play().catch(() => { });
                if (bgMusic) bgMusic.pause();
            }
        });

        const observerOptions = {
            root: null,
            threshold: 0.6 // Trigger when 60% of section is visible
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Section in view: Pause BG music, Unmute & Play Video
                    if (bgMusic && !bgMusic.paused) {
                        bgMusic.pause();
                        isPlaying = false; // Update state
                        soundBtn.innerHTML = '🔇';
                    }

                    herHeartVideo.volume = 1.0; // Ensure max volume
                    herHeartVideo.muted = false;
                    herHeartVideo.currentTime = 0; // Restart for impact

                    const playPromise = herHeartVideo.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(() => {
                            herHeartVideo.muted = true;
                        });
                    }
                } else {
                    // Section out of view: Mute/Pause Video
                    herHeartVideo.muted = true; // Mute
                    herHeartVideo.pause();

                    // Optional: We don't automatically resume BG music to avoid startling user
                }
            });
        }, observerOptions);

        observer.observe(herHeartSection);
    }

    // --- 2. Night Mode Logic ---
    const checkNightMode = () => {
        const hour = new Date().getHours();
        // Night mode between 22:00 (10 PM) and 05:00 (5 AM)
        if (hour >= 22 || hour < 5) {
            document.body.classList.add('night-theme');
        } else {
            document.body.classList.remove('night-theme');
        }
    };
    checkNightMode();
    // Re-check every minute
    setInterval(checkNightMode, 60000);

    // --- 3. Timeline Counter ---
    // Start Date: 24 January 2024
    // JS Months are 0-indexed (Jan = 0)
    const startDate = new Date(2024, 0, 24, 0, 0, 0).getTime();

    const updateTimer = () => {
        const now = new Date().getTime();
        const difference = now - startDate;

        if (difference < 0) return; // Should not happen given the date

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days;
        document.getElementById('hours').innerText = hours;
        document.getElementById('minutes').innerText = minutes;
        document.getElementById('seconds').innerText = seconds;
    };

    setInterval(updateTimer, 1000);
    updateTimer(); // Initial call


    // --- 4.5 Floating Hearts for Timeline ---
    const floatingHeartsContainer = document.querySelector('.floating-hearts-timeline');
    if (floatingHeartsContainer) {
        const createFloatingHeart = () => {
            const heart = document.createElement('div');
            heart.textContent = '❤️';
            heart.style.position = 'absolute';
            heart.style.fontSize = `${Math.random() * 1 + 4}rem`; // 4-5rem
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.bottom = '-10%';
            heart.style.opacity = '0';
            heart.style.color = '#ff0000'; // Bright red
            heart.style.filter = 'hue-rotate(-15deg) saturate(3) brightness(1.2) drop-shadow(0 0 10px red)';
            heart.style.zIndex = '20'; // Very high z-index
            heart.style.animation = `floatHeart ${Math.random() * 4 + 6}s ease-in forwards`;
            heart.style.animationDelay = `${Math.random() * 2}s`;

            floatingHeartsContainer.appendChild(heart);

            // Remove heart after animation completes
            setTimeout(() => {
                heart.remove();
            }, 10000);
        };

        // Create hearts periodically
        setInterval(createFloatingHeart, 2000);
        // Create initial batch
        for (let i = 0; i < 3; i++) {
            setTimeout(createFloatingHeart, i * 1000);
        }
    }

    // --- 5. Romantic Section Transitions ---
    const observeSections = () => {
        const sections = document.querySelectorAll('.content-section');

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.15, // Trigger when 15% of section is visible
            rootMargin: '0px 0px -50px 0px' // Start slightly before entering viewport
        });

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    };

    // Initialize section transitions
    observeSections();

    // --- Easter Egg: Hero Tap x5 ---
    let heroTapCount = 0;
    const heroTrigger = document.getElementById('hero-easter-egg-trigger');
    if (heroTrigger) {
        heroTrigger.addEventListener('click', () => {
            heroTapCount++;
            if (heroTapCount === 5) {
                alert("Hidden Message: You are my favorite distraction! ❤️");
                heroTapCount = 0;
            }
        });
    }

    // --- 5. Office Story Slider ---
    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    let currentSlide = 0;

    const showSlide = (index) => {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    };

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        });

        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        });
    }

    // --- 7. Map Secret (Long Press) ---
    const mapTrigger = document.getElementById('distance-map');
    let pressTimer;

    if (mapTrigger) {
        // Mouse events
        mapTrigger.addEventListener('mousedown', () => {
            pressTimer = setTimeout(() => {
                alert("Secret Message: No distance is too far for love. 🌍❤️");
            }, 2000);
        });

        mapTrigger.addEventListener('mouseup', () => {
            clearTimeout(pressTimer);
        });

        // Touch events
        mapTrigger.addEventListener('touchstart', () => {
            pressTimer = setTimeout(() => {
                alert("Secret Message: No distance is too far for love. 🌍❤️");
            }, 2000);
        });

        mapTrigger.addEventListener('touchend', () => {
            clearTimeout(pressTimer);
        });
    }

    // --- 9. Memory Flip Cards (Mobile Tap Support) ---
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });

    // --- 10. Private Love Lock ---
    const lockInput = document.getElementById('lock-input');
    const unlockBtn = document.getElementById('unlock-btn');
    const lockMsg = document.getElementById('lock-msg');
    const vaultSection = document.getElementById('secret-vault');

    if (unlockBtn) {
        unlockBtn.addEventListener('click', () => {
            const password = lockInput.value.trim().toLowerCase();
            if (password === 'love') {
                lockMsg.textContent = "Unlocked! Welcome home. ❤️";
                lockMsg.style.color = "#4cc9f0";

                // Vibrate if on mobile
                if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

                // Reveal Vault
                vaultSection.classList.remove('hidden-section');
                vaultSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                lockMsg.textContent = "Hmm… try again, love 😉";
                lockMsg.style.color = "#ff4d6d";
                lockInput.classList.add('shake');
                setTimeout(() => lockInput.classList.remove('shake'), 500);
            }
        });
    }

    // --- 11. Secret Vault Video Logic ---
    window.playVideo = (mood) => {
        const videoArea = document.getElementById('video-display-area');
        videoArea.style.display = 'flex';

        // Define video files
        let videoSrc = "";
        let caption = "";

        if (mood === 'miss') {
            videoSrc = "assets/videos/miss_you.mp4";
            caption = "When you miss me... ❤️";
        }
        if (mood === 'sad') {
            videoSrc = "assets/videos/cheer_up.mp4";
            caption = "Don't be sad... 🌈";
        }
        if (mood === 'angry') {
            videoSrc = "assets/videos/sorry.mp4";
            caption = "I'm sorry... 🥺";
        }

        videoArea.innerHTML = `
            <div style="text-align: center; width: 100%;">
                <p style="margin-bottom: 10px;">${caption}</p>
                <video controls autoplay playsinline webkit-playsinline style="width: 100%; max-width: 500px; border-radius: 10px; box-shadow: 0 0 20px rgba(255,255,255,0.1);">
                    <source src="${videoSrc}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
        `;
        videoArea.scrollIntoView({ behavior: 'smooth' });
    };

    // --- 12. AI Love Poem Generator ---
    const poems = [
        "Tuhinjo khilan, munjhi dil ji dhadkan... 💖\nTuhinjo disan, munjhi rooh jo sukoon. ✨\nTu aahin munjho saah, munjhi zindagi, 🌸\nTu aahin, ta sab kuch ahe, tu na ta kuch na. ❤️",
        "Saah wathan khan wadhik, 💨\nTokhe chahan tho ma. ❤️\nDil je har kone mein, ✨\nSirf tokhe rakhan tho ma. 💖",
        "Munjhi subuh tu, munjhi shaam tu, 🌅\nMunjhi nend aen munjhi khwab tu. 🌙\nDoor bhale hujo kitro bi, 🗺️\nPar munjhi har dua mein hamesha tu. 🙏💖",
        "Tuhinji aa har adaa pyaari, ✨\nLagay thi munjhi duniya saari. 🌍\nTu aahin munjhi jaan, munjho jahaan, ❤️\nTuhinje bina sub kuch aa veeran. 🥀",
        "Jiyan Dal Pakwan je beno adhuro aye, 🥗\nMa tunje beno adhuro aayan. ❤️\nTu aahin munjhi khushi, ✨\nMunjhi har gal jo saharyo aahin. 💍",
        "Tunji muskaan sada laye munjo suraj ahe. ☀️\nJadahn tu khilandee aahin, 🌸\nTa munjhi duniya chamkee uthandee aahe. ✨💖",
        "Jadeh Ho Muskrai Moon Daah Disndo Aahe, 😊\nGhum Jo Qiso Ute Hi Khatam Thi Windo Aahe. ✨\nTu aahin munjhi har marz ji dawa, 🏥\nMunjhi har dukh ji shifa aahin. ❤️",
        "Maan tokha pyaar kndo aayan, 💍\nSubahn khan shaam tayeen, ☀️🌙\nAen shaam khan subahn tayeen. ✨\nTu hamesha munjhi dil mein aahin. ❤️"
    ];

    const generateBtn = document.getElementById('generate-poem-btn');
    const poemDisplay = document.getElementById('poem-display');
    const poemText = document.getElementById('poem-text');

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            // Randomly select a poem
            const randomPoem = poems[Math.floor(Math.random() * poems.length)];

            // Show loading state
            generateBtn.innerText = "Writing...";
            generateBtn.disabled = true;

            setTimeout(() => {
                poemText.innerText = randomPoem;
                poemDisplay.classList.remove('hidden');
                generateBtn.innerText = "Write Another ✨";
                generateBtn.disabled = false;
            }, 1500); // 1.5s simulated delay
        });
    }

    // --- 13. Valentine Ask Section (Yes/No Buttons) ---
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const finalScreen = document.getElementById('final-screen');

    if (noBtn) {
        // Playful runaway logic
        const moveNoButton = (e) => {
            if (e && e.preventDefault) e.preventDefault();

            const maxX = window.innerWidth - noBtn.offsetWidth - 50;
            const maxY = window.innerHeight - noBtn.offsetHeight - 50;

            const x = Math.random() * maxX;
            const y = Math.random() * maxY;

            noBtn.style.position = 'fixed';
            noBtn.style.left = `${Math.max(10, x)}px`;
            noBtn.style.top = `${Math.max(10, y)}px`;
            noBtn.style.transition = 'all 0.3s ease';
            noBtn.style.zIndex = '9999';
        };

        noBtn.addEventListener('mouseenter', moveNoButton);
        noBtn.addEventListener('touchstart', moveNoButton);
        noBtn.addEventListener('click', moveNoButton);
    }

    if (yesBtn) {
        yesBtn.addEventListener('click', () => {
            // 1. Confetti Explosion
            if (typeof confetti !== 'undefined') {
                confetti({
                    particleCount: 200,
                    spread: 100,
                    origin: { y: 0.6 }
                });

                setTimeout(() => {
                    confetti({
                        particleCount: 150,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 }
                    });
                    confetti({
                        particleCount: 150,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 }
                    });
                }, 500);
            }

            // 2. Clear Ask Section and Show Final Screen
            const askSection = document.getElementById('valentine-ask');
            if (askSection) askSection.style.display = 'none';

            if (finalScreen) {
                // Stop Background Music
                const bgMusic = document.getElementById('bg-music');
                if (bgMusic) {
                    bgMusic.pause();
                    const soundBtn = document.getElementById('sound-btn');
                    if (soundBtn) soundBtn.innerHTML = '🔇';
                }

                finalScreen.classList.remove('hidden-section');
                finalScreen.style.display = 'flex';

                // Play Final Video with Sound
                const finalVideo = document.querySelector('.final-video');
                if (finalVideo) {
                    finalVideo.muted = false; // Ensure unmuted
                    finalVideo.volume = 1.0;
                    finalVideo.play().catch(() => { });
                }

                finalScreen.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // --- 16. Dynamic Flip Card Messages (Sindhi & Saree) ---
    window.handleFlip = (card, type) => {
        // Only generate text if opening the card (not when closing)
        if (!card.classList.contains('flipped')) {
            let textElement;
            let messages = [];

            if (type === 'sindhi') {
                textElement = document.getElementById('sindhi-text');
                messages = [
                    "Tuhinjo khilan... uff! My heart melts. 💖",
                    "Sohni suhni Sindhi chokri! (Beautiful girl) ✨",
                    "You are the 'Dal Pakwan' to my Sunday morning. Perfect combo!",
                    "Dil chwaye thi, tokhe disando raha. (My heart says keep looking at you).",
                    "Tuhinjo nalo chha ahe? My Destiny. 😉",
                    "Arey Hallooo! You stole my heart just like that!",
                    "Your Sindhi accent is the cutest melody I've ever heard. 🎶"
                ];
            } else if (type === 'saree') {
                textElement = document.getElementById('saree-text');
                messages = [
                    "Saree mein lagti ho aag! 🔥 (You look like fire!)",
                    "Six yards of pure elegance. You take my breath away.",
                    "Western is cool, but you in a Saree? Maar daala! 😵",
                    "Just one look in that Saree and I'm yours forever.",
                    "Red, Blue, or Black... In a Saree, you are a Queen. 👑",
                    "Param Sundari looks jealous when you wear a Saree.",
                    "Tuhinje saree jo rang, munhje dil jo rang. (Color of your saree context). ❤️"
                ];
            }

            // Random selection
            const randomMsg = messages[Math.floor(Math.random() * messages.length)];
            if (textElement) textElement.innerText = randomMsg;
        }

        // Toggle flip class
        card.classList.toggle('flipped');
    };

    // --- 17. Leaflet Map Implementation (Germany -> India) ---
    // Delay slightly to ensure library loads
    setTimeout(() => {
        const mapElement = document.getElementById('leaflet-map');
        // Check if Leaflet is loaded
        if (!mapElement || !window.L) return;

        // Coordinates
        const germanyCoords = [51.1657, 10.4515]; // Germany
        const indiaCoords = [20.5937, 78.9629];   // India

        // Initialize Map
        const map = L.map('leaflet-map', {
            center: [30, 50],
            zoom: 3,
            zoomControl: false,
            dragging: false, // Cinematic static view
            scrollWheelZoom: false,
            doubleClickZoom: false,
            attributionControl: false
        });

        // Dark Theme Tile Layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            subdomains: 'abcd'
        }).addTo(map);

        // Custom Icons
        const createCustomIcon = (imgSrc, label) => {
            return L.divIcon({
                className: 'custom-map-marker',
                html: `
                    <div class="marker-content">
                        <img src="${imgSrc}" class="marker-img">
                        <span class="marker-label">${label}</span>
                    </div>
                `,
                iconSize: [60, 80],
                iconAnchor: [30, 40]
            });
        };

        const deIcon = createCustomIcon('assets/images/location_de.jpg', 'Germany');
        const inIcon = createCustomIcon('assets/images/location_in.jpg', 'India');

        // Add Markers
        L.marker(germanyCoords, { icon: deIcon }).addTo(map);
        L.marker(indiaCoords, { icon: inIcon }).addTo(map);

        // Fit Bounds to show both (Adjust padding for mobile)
        const isMobile = window.innerWidth < 768;
        const bounds = L.latLngBounds([germanyCoords, indiaCoords]);
        map.fitBounds(bounds, { padding: isMobile ? [20, 20] : [50, 50] });

        // Draw Curved Path
        const latDiff = indiaCoords[0] - germanyCoords[0];
        const lngDiff = indiaCoords[1] - germanyCoords[1];
        const midPoint = [
            germanyCoords[0] + latDiff / 2 + 20, // Curve UP
            germanyCoords[1] + lngDiff / 2
        ];

        const pathPoints = [];
        for (let t = 0; t <= 1; t += 0.01) {
            const lat = (1 - t) * (1 - t) * germanyCoords[0] + 2 * (1 - t) * t * midPoint[0] + t * t * indiaCoords[0];
            const lng = (1 - t) * (1 - t) * germanyCoords[1] + 2 * (1 - t) * t * midPoint[1] + t * t * indiaCoords[1];
            pathPoints.push([lat, lng]);
        }

        const polyline = L.polyline(pathPoints, {
            color: 'white',
            weight: 2,
            opacity: 0.6,
            dashArray: '5, 10',
            lineCap: 'round'
        }).addTo(map);

        // Plane Animation Function
        const createPlane = (delay) => {
            const planeIcon = L.divIcon({
                className: 'plane-marker',
                html: '<i class="fas fa-plane plane-icon"></i>',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });

            const planeMarker = L.marker(germanyCoords, { icon: planeIcon, opacity: 0 }).addTo(map); // Start hidden

            let step = 0;
            const totalSteps = pathPoints.length;

            // Start after delay
            setTimeout(() => {
                planeMarker.setOpacity(1); // Show plane
                setInterval(() => {
                    if (step < totalSteps) {
                        const coord = pathPoints[step];
                        planeMarker.setLatLng(coord);

                        if (step < totalSteps - 1) {
                            const nextCoord = pathPoints[step + 1];
                            const dy = nextCoord[0] - coord[0];
                            const dx = nextCoord[1] - coord[1];
                            const angle = Math.atan2(dx, dy) * (180 / Math.PI);

                            const icon = planeMarker.getElement()?.querySelector('i');
                            if (icon) icon.style.transform = `rotate(${angle}deg)`;
                        }
                        step++;
                    } else {
                        step = 0; // Loop seamlessly
                    }
                }, 50);
            }, delay);
        };

        // Create 3 Planes with different delays for a "busy route" feel
        createPlane(0);      // Immediate
        createPlane(2000);   // 2s later
        createPlane(4000);   // 4s later

    }, 1000);

    // --- 18. Dynamic First Chat Sequence ---
    const chatSection = document.getElementById('first-chat');
    const chatBubbles = document.querySelectorAll('#first-chat .chat-bubble:not(#typing-indicator)');
    const chatImage = document.querySelector('#first-chat .chat-image-container');
    const typingIndicator = document.getElementById('typing-indicator');

    if (chatSection && chatBubbles.length > 0) {
        let hasAnimated = false;

        const animateChat = async () => {
            if (hasAnimated) return;
            hasAnimated = true;

            const delay = (ms) => new Promise(res => setTimeout(res, ms));

            for (let i = 0; i < chatBubbles.length; i++) {
                const bubble = chatBubbles[i];

                // Show typing indicator
                if (typingIndicator) {
                    typingIndicator.style.display = 'block';
                    typingIndicator.classList.remove('hidden');
                    // Position it based on who is "typing"
                    if (bubble.classList.contains('right')) {
                        typingIndicator.style.alignSelf = 'flex-end';
                        typingIndicator.classList.remove('left');
                        typingIndicator.classList.add('right');
                        typingIndicator.style.background = 'var(--primary-color)';
                    } else {
                        typingIndicator.style.alignSelf = 'flex-start';
                        typingIndicator.classList.remove('right');
                        typingIndicator.classList.add('left');
                        typingIndicator.style.background = 'rgba(255, 255, 255, 0.1)';
                    }
                }

                await delay(700); // Faster simulated typing time

                // Hide typing indicator
                if (typingIndicator) {
                    typingIndicator.classList.add('hidden');
                    typingIndicator.style.display = 'none';
                }

                // Show bubble
                bubble.style.opacity = '1';
                bubble.classList.add('fade-in');

                // Extra delay between messages
                await delay(400);
            }

            // Finally show image
            if (chatImage) {
                chatImage.style.opacity = '1';
                chatImage.classList.add('fade-in');
            }
        };

        const chatObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateChat();
                }
            });
        }, { threshold: 0.2 }); // Lower threshold for better reliability

        chatObserver.observe(chatSection);
    }

    // --- 19. Floating Next Section Button Logic ---
    const floatingNextBtn = document.getElementById('next-section-btn');
    const allSections = Array.from(document.querySelectorAll('section'));
    const finalSection = document.getElementById('final-screen');

    if (floatingNextBtn) {
        floatingNextBtn.addEventListener('click', () => {
            // Find current section in view
            let currentSectionIndex = -1;
            const scrollPos = window.scrollY + window.innerHeight / 2;

            allSections.forEach((section, index) => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                if (scrollPos >= sectionTop && scrollPos <= sectionBottom) {
                    currentSectionIndex = index;
                }
            });

            // Scroll to next section
            if (currentSectionIndex !== -1 && currentSectionIndex < allSections.length - 1) {
                const nextSectionTarget = allSections[currentSectionIndex + 1];
                nextSectionTarget.scrollIntoView({ behavior: 'smooth' });
            }
        });

        // Hide button ONLY when final screen is visible
        if (finalSection) {
            const hideObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        floatingNextBtn.classList.add('hidden');
                    } else {
                        floatingNextBtn.classList.remove('hidden');
                    }
                });
            }, { threshold: 0.1 });
            hideObserver.observe(finalSection);
        }
    }

}); // End of DOMContentLoaded
