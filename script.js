// LOADER REMOVAL
window.addEventListener("load", () => {
    setTimeout(() => {
        const loader = document.getElementById("loader");
        loader.style.opacity = "0";
        setTimeout(() => {
            loader.style.display = "none";
        }, 800);
    }, 1500); // Wait 1.5s to show the cool VIZ loader
});

// TYPING EFFECT
const textArray = ["AI/ML Student", "Web Developer", "Creative Thinker", "Tech Enthusiast"];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById("typing");

function typeWord() {
    const currentWord = textArray[textIndex];
    if (isDeleting) {
        typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; // Pause at end of word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % textArray.length;
        typeSpeed = 500; // Pause before new word
    }

    setTimeout(typeWord, typeSpeed);
}
// Start typing
if (typingElement) {
    setTimeout(typeWord, 2000);
}

// SCROLL REVEAL ANIMATIONS
const revealElements = document.querySelectorAll(".reveal");

function reveal() {
    const windowHeight = window.innerHeight;
    const elementVisible = 100;

    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            el.classList.add("active");
        }
    });
}
window.addEventListener("scroll", reveal);
reveal(); // Trigger once on load

// NAVBAR BACKGROUND BLUR ON SCROLL
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.style.background = "rgba(5, 5, 8, 0.85)";
        navbar.style.boxShadow = "0 5px 20px rgba(0,0,0,0.5)";
    } else {
        navbar.style.background = "rgba(5, 5, 8, 0.4)";
        navbar.style.boxShadow = "none";
    }
});



// WELCOME AUDIO ON LOAD
window.addEventListener("load", () => {
    let hasPlayed = false;

    const playWelcomeAudio = () => {
        if (hasPlayed) return;

        const msg = new SpeechSynthesisUtterance("Welcome to the Akku universe.");
        msg.rate = 0.9;
        msg.pitch = 1;
        msg.volume = 1;

        msg.onstart = () => {
            hasPlayed = true;
        };

        window.speechSynthesis.speak(msg);
    };

    // Try playing immediately (might be blocked by browser autoplay policies)
    setTimeout(playWelcomeAudio, 500);

    // Fallback: Play on first interaction if autoplay was blocked
    const interactionEvents = ["click", "keydown", "touchstart"];
    const onInteraction = () => {
        if (!hasPlayed) {
            playWelcomeAudio();
        }
        interactionEvents.forEach(evt => document.removeEventListener(evt, onInteraction));
    };

    interactionEvents.forEach(evt => document.addEventListener(evt, onInteraction));
});

// PORTFOLIO TABS
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const navTabLinks = document.querySelectorAll('[data-open-tab]');

function activatePortfolioTab(tabId) {
    if (!tabId || tabBtns.length === 0) return;

    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    const activeBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    const activeContent = document.getElementById(`tab-${tabId}`);

    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    if (activeContent) {
        activeContent.classList.add('active');
    }
}

if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            activatePortfolioTab(tabId);
            
            // Trigger scroll reveal for new elements if applicable
            if (typeof reveal === 'function') {
                setTimeout(reveal, 100);
            }
        });
    });
}

if (navTabLinks.length > 0) {
    navTabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const tabId = link.getAttribute('data-open-tab');
            activatePortfolioTab(tabId);
        });
    });
}

// CERTIFICATE LIGHTBOX
const certificateBtns = document.querySelectorAll(".certificate-open-btn");
const certificateLightbox = document.getElementById("certificateLightbox");
const certificateLightboxImg = document.getElementById("certificateLightboxImg");
const certificateLightboxClose = document.getElementById("certificateLightboxClose");

if (certificateBtns.length > 0 && certificateLightbox && certificateLightboxImg && certificateLightboxClose) {
    const openCertificateLightbox = (imgSrc, imgAlt) => {
        certificateLightboxImg.src = imgSrc;
        certificateLightboxImg.alt = imgAlt || "Certificate full preview";
        certificateLightbox.classList.add("active");
        certificateLightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    };

    const closeCertificateLightbox = () => {
        certificateLightbox.classList.remove("active");
        certificateLightbox.setAttribute("aria-hidden", "true");
        certificateLightboxImg.src = "";
        document.body.style.overflow = "";
    };

    certificateBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const certImg = btn.querySelector(".certificate-img");
            if (!certImg) return;
            openCertificateLightbox(certImg.src, certImg.alt);
        });
    });

    certificateLightboxClose.addEventListener("click", closeCertificateLightbox);

    certificateLightbox.addEventListener("click", (event) => {
        if (event.target === certificateLightbox) {
            closeCertificateLightbox();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && certificateLightbox.classList.contains("active")) {
            closeCertificateLightbox();
        }
    });
}

// CONTACT FORM SUBMISSION (Web3Forms)
const contactForm = document.getElementById("contactForm");
const formResult = document.getElementById("formResult");

if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const loaderBtn = document.getElementById("submitBtn");
        const btnText = loaderBtn.querySelector("span");
        const originalText = btnText.textContent;

        // "Sending..." state
        btnText.textContent = "Sending...";
        loaderBtn.disabled = true;

        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);

        // Your Web3Forms Access Key
        object.access_key = ""; // Insert target key here

        const json = JSON.stringify(object);

        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: json
        })
            .then(async (response) => {
                let res = await response.json();
                if (response.status == 200) {
                    formResult.textContent = "Message sent successfully!";
                    formResult.classList.add("success");
                    contactForm.reset();
                } else {
                    formResult.textContent = res.message;
                    formResult.classList.add("error");
                }
            })
            .catch(error => {
                console.log(error);
                formResult.textContent = "Something went wrong!";
                formResult.classList.add("error");
            })
            .then(function () {
                loaderBtn.disabled = false;
                btnText.textContent = originalText;
                setTimeout(() => {
                    formResult.style.display = "none";
                    formResult.classList.remove("success", "error");
                }, 6000);
            });
    });
}
