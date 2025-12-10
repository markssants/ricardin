document.addEventListener('DOMContentLoaded', () => {
    let updateMotoPosition = () => { }; // Placeholder for the function

    // --- Lógica para o Menu Hambúrguer ---
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');

    if (hamburger && navList) {
        hamburger.addEventListener('click', () => {
            // Alterna a classe 'active' para mostrar/esconder o menu
            navList.classList.toggle('active');
            // Adiciona uma animação ao ícone do hambúrguer
            hamburger.classList.toggle('active');
        });

        // Fecha o menu ao clicar em um link (em telas móveis)
        document.querySelectorAll('.nav-list li a').forEach(link => {
            link.addEventListener('click', () => {
                if (navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            });
        });
    }

    // --- Lógica para Rolagem Suave (Smooth Scrolling) ---
    // --- Lógica para Rolagem Suave Personalizada (Efeito "Parallax" / Gliding) ---
    // Scroll Spy for Active Nav Link
    const sections = document.querySelectorAll('section');
    const scrollNavLinks = document.querySelectorAll('.nav-list a');

    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px', // Trigger when section is in the middle of the viewport
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                let targetHref = `#${id}`;

                // Mobile override: Map Identidade and Testimonials to Contact link
                if (window.innerWidth <= 768) {
                    if (id === 'identidade' || id === 'testimonials') {
                        targetHref = '#contact';
                    }
                }

                scrollNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === targetHref) {
                        link.classList.add('active');
                    }
                });
                // Update moto position when active link changes
                updateMotoPosition();
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Configurações da animação
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const startPosition = window.pageYOffset;
                const headerOffset = 85; // Altura do header fixo
                const distance = targetPosition - startPosition - headerOffset;
                const duration = 1500; // Duração em ms (mais lento para efeito "gliding")
                let start = null;

                // Função de Easing (easeInOutCubic - começa devagar, acelera, termina devagar)
                const easeInOutCubic = (t, b, c, d) => {
                    t /= d / 2;
                    if (t < 1) return c / 2 * t * t * t + b;
                    t -= 2;
                    return c / 2 * (t * t * t + 2) + b;
                };

                const animation = (currentTime) => {
                    if (start === null) start = currentTime;
                    const timeElapsed = currentTime - start;
                    const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);

                    window.scrollTo(0, run);

                    if (timeElapsed < duration) {
                        requestAnimationFrame(animation);
                    }
                };

                requestAnimationFrame(animation);
            }
        });
    });

    // Floating Icon Logic
    const floatingMoto = document.getElementById('floating-moto');
    const logo = document.querySelector('.logo');
    const navLinks = document.querySelectorAll('.nav-list a:not(.nav-btn)');
    const headerContainer = document.querySelector('.header-container');

    if (floatingMoto && logo && headerContainer) {

        // Function to set initial position (at logo)
        const setInitialPosition = () => {
            const logoRect = logo.getBoundingClientRect();
            const containerRect = headerContainer.getBoundingClientRect();

            const initialLeft = (logoRect.left - containerRect.left) + logoRect.width + 10;
            const initialTop = (logoRect.top - containerRect.top) + (logoRect.height / 2) - (50 / 2);

            floatingMoto.style.width = '50px';
            floatingMoto.style.height = '50px';
            floatingMoto.style.top = `${initialTop}px`;
            floatingMoto.style.left = `${initialLeft}px`;
            floatingMoto.style.opacity = '1';
        };

        // Function to move to active link or fallback to logo
        const moveToActiveLink = () => {
            const activeLink = document.querySelector('.nav-list a.active');

            // Check if active link exists and is visible
            if (activeLink && activeLink.offsetParent !== null) {
                const linkRect = activeLink.getBoundingClientRect();
                const containerRect = headerContainer.getBoundingClientRect();

                // Nav icon size: 25px
                const targetTop = linkRect.top - containerRect.top + (linkRect.height / 2) - (25 / 2);
                const targetLeft = (linkRect.left - containerRect.left);

                floatingMoto.style.width = '25px';
                floatingMoto.style.height = '25px';
                floatingMoto.style.top = `${targetTop}px`;
                floatingMoto.style.left = `${targetLeft}px`;
                floatingMoto.style.opacity = '1';
            } else {
                setInitialPosition();
            }
        };

        // Assign to the outer variable so observer can use it
        updateMotoPosition = moveToActiveLink;

        // Initialize position
        setTimeout(moveToActiveLink, 100);

        // Update on resize
        window.addEventListener('resize', moveToActiveLink);

        // Hover effects removed as per user request. Moto only moves on click/scroll (active state).
    }

    // --- Lógica para o Formulário de Contato ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Impede o recarregamento da página
            alert('Obrigado! Sua mensagem foi enviada. Entraremos em contato em breve.');
            contactForm.reset(); // Limpa os campos do formulário
        });
    }

    // Social Speed Dial Delay Logic
    const socialContainer = document.querySelector('.social-float-container');
    let socialTimeout;

    if (socialContainer) {
        socialContainer.addEventListener('mouseenter', () => {
            clearTimeout(socialTimeout);
            socialContainer.classList.add('active');
        });

        socialContainer.addEventListener('mouseleave', () => {
            socialTimeout = setTimeout(() => {
                socialContainer.classList.remove('active');
            }, 2000);
        });
    }

    // Simulate Moto Start on Click (Reusable Function)
    function addMotoAnimation(element) {
        if (!element) return;

        element.addEventListener('click', (e) => {
            e.preventDefault();

            // Prevent multiple clicks while animating
            if (element.classList.contains('engine-start') || element.classList.contains('drive-away')) return;

            element.classList.add('engine-start');

            // Vibration
            if (navigator.vibrate) {
                navigator.vibrate(1000); // Vibrate for 1s
            }

            // Generate Smoke Particles
            const smokeInterval = setInterval(() => {
                const smoke = document.createElement('div');
                smoke.classList.add('smoke-particle');

                // Position smoke near the back of the moto (assuming moto faces right)
                const rect = element.getBoundingClientRect();
                const randomX = Math.random() * 10 + 15; // Further to the right (15 to 25)
                const randomY = Math.random() * 10 - 110; // Much higher up (rect.height - 120 to -110)

                smoke.style.left = `${rect.left + randomX}px`;
                smoke.style.top = `${rect.top + rect.height - 10 + randomY}px`;

                document.body.appendChild(smoke);

                // Remove particle after animation
                setTimeout(() => {
                    smoke.remove();
                }, 1000);
            }, 100); // New particle every 100ms

            // After 1 second, stop initial smoke and drive away
            setTimeout(() => {
                clearInterval(smokeInterval);
                element.classList.remove('engine-start');
                element.classList.add('drive-away');

                // Continue generating smoke while driving
                const drivingSmokeInterval = setInterval(() => {
                    const smoke = document.createElement('div');
                    smoke.classList.add('smoke-particle');

                    const rect = element.getBoundingClientRect();
                    const randomX = Math.random() * 10 + 15;
                    const randomY = Math.random() * 10 - 110;

                    smoke.style.left = `${rect.left + randomX}px`;
                    smoke.style.top = `${rect.top + rect.height - 10 + randomY}px`;

                    document.body.appendChild(smoke);

                    setTimeout(() => {
                        smoke.remove();
                    }, 1000);
                }, 100);

                // Stop driving smoke after animation completes (1s animation)
                setTimeout(() => {
                    clearInterval(drivingSmokeInterval);
                }, 1000); // Wait for logo drive-away animation to complete (1s)

                // Check if this is the logo element
                const isLogo = element.closest('.logo') !== null;

                if (isLogo) {
                    // Trigger floating moto immediately after drive-away
                    setTimeout(() => {
                        triggerFloatingMotoToInicio(() => {
                            // Wait 3 seconds after floating moto arrives before logo reappears
                            setTimeout(() => {
                                // Just remove the drive-away class to make logo reappear
                                element.classList.remove('drive-away');
                            }, 3000);
                        });
                    }, 1000);
                } else {
                    // For hero icon, return normally after 1s
                    setTimeout(() => {
                        element.classList.remove('drive-away');
                        element.style.animation = 'returnFromLeft 1s forwards ease-out';

                        // Generate smoke while returning
                        const returningSmokeInterval = setInterval(() => {
                            const smoke = document.createElement('div');
                            smoke.classList.add('smoke-particle');

                            const rect = element.getBoundingClientRect();
                            const randomX = Math.random() * 10 + 15;
                            const randomY = Math.random() * 10 - 110;

                            smoke.style.left = `${rect.left + randomX}px`;
                            smoke.style.top = `${rect.top + rect.height - 10 + randomY}px`;

                            document.body.appendChild(smoke);

                            setTimeout(() => {
                                smoke.remove();
                            }, 1000);
                        }, 100);

                        // Clear inline animation and stop smoke after it completes
                        setTimeout(() => {
                            element.style.animation = '';
                            clearInterval(returningSmokeInterval);
                        }, 1000);
                    }, 1000);
                }
            }, 1000);
        });
    }

    // Function to move floating moto to Início link
    function triggerFloatingMotoToInicio(callback) {
        const floatingMoto = document.getElementById('floating-moto');
        const inicioLink = document.querySelector('.nav-list a[href="#home"]');
        const headerContainer = document.querySelector('.header-container');

        if (!floatingMoto || !inicioLink || !headerContainer) return;

        const linkRect = inicioLink.getBoundingClientRect();
        const containerRect = headerContainer.getBoundingClientRect();

        const targetTop = linkRect.top - containerRect.top + (linkRect.height / 2) - (25 / 2);
        const targetLeft = (linkRect.left - containerRect.left);

        // Animate to Início link (faster now)
        floatingMoto.style.transition = 'all 1.2s ease-in-out';
        floatingMoto.style.width = '25px';
        floatingMoto.style.height = '25px';
        floatingMoto.style.top = `${targetTop}px`;
        floatingMoto.style.left = `${targetLeft}px`;
        floatingMoto.style.opacity = '1';

        // Call callback after animation completes (1.2s)
        if (callback) {
            setTimeout(callback, 1200);
        }
    }

    // Apply to Logo
    const logoImg = document.querySelector('.logo img');
    addMotoAnimation(logoImg);

    // Apply to Hero Icon
    const heroIconImg = document.querySelector('.hero-icon img');
    addMotoAnimation(heroIconImg);

});

// Handle Row Hover (Open on Hover)
function handleRowHover(row) {
    if (!row.classList.contains('active')) {
        toggleSubOptions(row);
    }
}

// Toggle Sub-options Function (Global Scope)
function toggleSubOptions(row) {
    const nextRow = row.nextElementSibling;
    const icon = row.querySelector('.toggle-icon');
    const allExpandableRows = document.querySelectorAll('.expandable-row');

    // Close all other rows
    allExpandableRows.forEach(otherRow => {
        if (otherRow !== row) {
            const otherNextRow = otherRow.nextElementSibling;
            const otherIcon = otherRow.querySelector('.toggle-icon');

            otherRow.classList.remove('active');
            if (otherNextRow && otherNextRow.classList.contains('sub-options-row')) {
                otherNextRow.style.display = 'none';
            }
            if (otherIcon) {
                otherIcon.style.transform = 'rotate(0deg)';
            }
        }
    });

    // Toggle current row
    row.classList.toggle('active');
    if (nextRow && nextRow.classList.contains('sub-options-row')) {
        if (nextRow.style.display === 'none' || nextRow.style.display === '') {
            nextRow.style.display = 'grid'; // Changed from table-row to grid to match CSS
            icon.style.transform = 'rotate(180deg)';
        } else {
            nextRow.style.display = 'none';
            icon.style.transform = 'rotate(0deg)';
        }
    }
}

// WhatsApp Form Submission
// WhatsApp Form Submission (Simplified)
function sendToWhatsapp() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !phone || !message) {
        alert('Por favor, preencha todos os campos (Nome, Telefone e Mensagem) antes de enviar.');
        return;
    }

    const whatsappNumber = '5538998192163';
    const text = `*Novo Contato via Site*\n\n*Nome:* ${name}\n*Telefone:* ${phone}\n*Mensagem:* ${message}`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

    window.open(whatsappUrl, '_blank');
}