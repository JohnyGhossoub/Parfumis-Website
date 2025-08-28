/* Combined script.js - Canvas Animation, FAQ Logic, and Contact Form Logic */

/* Active Page Detection for Navigation */
document.addEventListener("DOMContentLoaded", function () {
    // Get current page path
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    // Find navigation links and mark current page as active (Desktop)
    const navLinks = document.querySelectorAll('header nav a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        }
    });
    
    // Find mobile navigation links and mark current page as active
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-item');
    mobileNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        }
    });
    
    // Add smooth scrolling to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                this.style.pointerEvents = 'none';
                
                // Remove loading state after animation
                setTimeout(() => {
                    this.classList.remove('loading');
                    this.style.pointerEvents = 'auto';
                }, 1000);
            }
        });
    });
});

/* Canvas Animation Logic */
const canvas = document.getElementById("canvas-bg");
if (canvas) {
    const ctx = canvas.getContext("2d");

    // Resize canvas to full window size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Parameters for the wedge region
    function getWedgeParameters() {
        const startX = canvas.width * 3 / 16;
        const midY = canvas.height * 7 / 12;
        const tan30 = Math.tan(Math.PI / 6);
        return { startX, midY, tan30 };
    }

    // Utility: Draw a droplet with a gradient
    function drawDroplet(x, y, radius, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        const gradient = ctx.createRadialGradient(x, y - radius * 0.6, radius * 0.1, x, y, radius);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.5, 'rgba(192,192,192,1)');
        gradient.addColorStop(1, 'rgba(128,128,128,1)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(x, y - radius);
        ctx.bezierCurveTo(x + radius, y - radius, x + radius, y + radius, x, y + radius * 1.5);
        ctx.bezierCurveTo(x - radius, y + radius, x - radius, y - radius, x, y - radius);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    // Particle (Droplet) Setup
    let particles = [];
    class Particle {
        constructor(x, y, radius, velocityX, velocityY) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.velocityX = velocityX;
            this.velocityY = velocityY;
        }
        update() {
            this.x += this.velocityX;
            this.y += this.velocityY;
            this.velocityX *= 0.98;
            this.velocityY *= 0.98;

            const { startX, midY, tan30 } = getWedgeParameters();
            if (this.x < startX || this.x > canvas.width) {
                this.velocityX = -this.velocityX;
            }
            const deltaX = this.x - startX;
            const currentYMin = midY - tan30 * deltaX;
            const currentYMax = midY + tan30 * deltaX;
            if (this.y < currentYMin || this.y > currentYMax) {
                this.velocityY = -this.velocityY;
            }
        }
        draw() {
            drawDroplet(this.x, this.y, this.radius, 0.3);
        }
    }

    function initParticles(count) {
        particles = [];
        const { startX, midY, tan30 } = getWedgeParameters();
        for (let i = 0; i < count; i++) {
            const radius = Math.random() * 2 + 1;
            const x = startX + Math.sqrt(Math.random()) * (canvas.width - startX);
            const deltaX = x - startX;
            const yMin = midY - tan30 * deltaX;
            const yMax = midY + tan30 * deltaX;
            const y = yMin + Math.random() * (yMax - yMin);
            const velocityX = (Math.random() - 0.5) * 1.5;
            const velocityY = (Math.random() - 0.5) * 1.5;
            particles.push(new Particle(x, y, radius, velocityX, velocityY));
        }
    }
    initParticles(2000);

    window.addEventListener("mousemove", (event) => {
        const mousePos = { x: event.clientX, y: event.clientY };
        particles.forEach(particle => {
            const dx = particle.x - mousePos.x;
            const dy = particle.y - mousePos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                const sprayAngle = Math.random() * Math.PI * 2;
                const sprayForce = Math.random() * 0.5;
                particle.velocityX += Math.cos(sprayAngle) * sprayForce;
                particle.velocityY += Math.sin(sprayAngle) * sprayForce;
            }
        });
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

/* FAQ Logic with Accordion Behavior */
document.addEventListener("DOMContentLoaded", function () {
    // Get all FAQ questions
    var faqQuestions = document.querySelectorAll(".faq-question");
    
    // Add click and keyboard event listeners to each question
    faqQuestions.forEach(function (question) {
        question.addEventListener("click", function () {
            toggleFAQ(this);
        });
        
        question.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleFAQ(this);
            }
        });
    });
    
    function toggleFAQ(questionElement) {
        const faqItem = questionElement.parentElement;
        const isActive = faqItem.classList.contains("active");
        
        // Close all other FAQ items first (accordion behavior)
        const allFaqItems = document.querySelectorAll(".faq-item");
        allFaqItems.forEach(function (item) {
            if (item !== faqItem) {
                item.classList.remove("active");
                const question = item.querySelector(".faq-question");
                if (question) {
                    question.setAttribute("aria-expanded", "false");
                }
            }
        });
        
        // Toggle current FAQ item
        if (isActive) {
            faqItem.classList.remove("active");
            questionElement.setAttribute("aria-expanded", "false");
        } else {
            faqItem.classList.add("active");
            questionElement.setAttribute("aria-expanded", "true");
        }
    }
});

/* Contact Form Logic */
(function () {
    var formContainer = document.getElementById("form-container");
    if (!formContainer) return; // Only execute on pages with the contact form

    const flows = {
        issue: {
            endpoint: "/submitContact?type=issue",
            steps: [
                { question: "Please provide your first name:", type: "text", name: "firstName" },
                { question: "Please provide your last name:", type: "text", name: "lastName" },
                { question: "Contact Phone Number:", type: "tel", name: "phone" },
                { question: "Email Address:", type: "email", name: "email" },
                { question: "Location of the issue:", type: "text", name: "location" },
                { question: "Date of the incident:", type: "date", name: "date" },
                { question: "Time of the incident:", type: "time", name: "time" },
                {
                    question: "Nature of the issue:",
                    type: "radio",
                    name: "issueType",
                    options: ["Payment Issue", "Machine Malfunction", "Other"]
                },
                { question: "Please describe the issue in detail:", type: "textarea", name: "issueDescription" }
            ]
        },
        host: {
            endpoint: "/submitContact?type=host",
            steps: [
                { question: "First Name:", type: "text", name: "firstName" },
                { question: "Last Name:", type: "text", name: "lastName" },
                { question: "Phone Number:", type: "tel", name: "phone" },
                { question: "Email Address:", type: "email", name: "email" },
                { question: "Business Name:", type: "text", name: "businessName" },
                { question: "Business Address:", type: "text", name: "address" },
                {
                    question: "Type of Business:",
                    type: "select",
                    name: "businessType",
                    options: ["Retail", "Hospitality", "Entertainment", "Other"]
                },
                { question: "Average Daily Traffic:", type: "number", name: "dailyVisitors" }
            ]
        },
        buy: {
            endpoint: "/submitContact?type=buy",
            steps: [
                { question: "First Name:", type: "text", name: "firstName" },
                { question: "Last Name:", type: "text", name: "lastName" },
                { question: "Phone Number:", type: "tel", name: "phone" },
                { question: "Email Address:", type: "email", name: "email" },
                { question: "Business Name (if applicable):", type: "text", name: "businessName" },
                {
                    question: "Please explain your interest in purchasing a Parfumis machine:",
                    type: "textarea",
                    name: "purchaseInterest"
                }
            ]
        },
        ad: {
            endpoint: "/submitContact?type=ad",
            steps: [
                { question: "First Name:", type: "text", name: "firstName" },
                { question: "Last Name:", type: "text", name: "lastName" },
                { question: "Phone Number:", type: "tel", name: "phone" },
                { question: "Email Address:", type: "email", name: "email" },
                { question: "Business Name:", type: "text", name: "businessName" },
                {
                    question: "Type of Business:",
                    type: "select",
                    name: "businessType",
                    options: ["Retail", "Hospitality", "Entertainment", "Other"]
                },
                {
                    question: "Proposed Advertising Budget Per Month",
                    type: "number",
                    name: "adBudget"
                }
            ]
        },
        request: {
            endpoint: "/submitContact?type=request",
            steps: [
                { question: "First Name:", type: "text", name: "firstName" },
                { question: "Last Name:", type: "text", name: "lastName" },
                { question: "Phone Number:", type: "tel", name: "phone" },
                { question: "Email Address:", type: "email", name: "email" },
                { question: "Which fragrance are you requesting?", type: "text", name: "requestedParfum" }
            ]
        },
        general: {
            endpoint: "/submitContact?type=general",
            steps: [
                { question: "First Name:", type: "text", name: "firstName" },
                { question: "Last Name:", type: "text", name: "lastName" },
                { question: "Phone Number:", type: "tel", name: "phone" },
                { question: "Email Address:", type: "email", name: "email" },
                { question: "How can we assist you?", type: "textarea", name: "inquiry" }
            ]
        }
    };

    const initialStep = {
        question: "Why are you contacting us?",
        type: "buttons",
        name: "contactReason",
        options: [
            { label: "Report Issue", value: "issue" },
            { label: "General Inquiry", value: "general" },
            { label: "Parfum Request", value: "request" },
            { label: "Host Parfumis", value: "host" },
            { label: "Buy Parfumis", value: "buy" },
            { label: "Parfumis Ads", value: "ad" }
        ]
    };

    let currentFlow = null;
    let currentStepIndex = -1;
    let responses = {};

    function createProgressBar() {
        const progressBarContainer = document.createElement("div");
        progressBarContainer.className = "progress-bar-container";
        const progressBar = document.createElement("progress");
        progressBar.value = currentStepIndex + 1;
        progressBar.max = currentFlow.steps.length;
        progressBar.style.width = "100%";
        progressBarContainer.appendChild(progressBar);
        return progressBarContainer;
    }

    function renderInitialStep() {
        currentStepIndex = -1;
        responses = {};
        formContainer.innerHTML = "";

        const stepDiv = document.createElement("div");
        stepDiv.className = "form-step";

        const optionsDiv = document.createElement("div");
        optionsDiv.className = "options options-buttons";
        initialStep.options.forEach((opt, index) => {
            const optionButton = document.createElement("button");
            optionButton.textContent = opt.label;
            optionButton.style.animationDelay = `${0.2 + index * 0.2}s`;
            optionButton.addEventListener("click", () => {
                responses[initialStep.name] = opt.value;
                currentFlow = flows[opt.value];
                currentStepIndex = 0;
                renderCurrentStep();
            });
            optionsDiv.appendChild(optionButton);
        });

        stepDiv.appendChild(optionsDiv);
        formContainer.appendChild(stepDiv);
        renderNavigationButtons();
    }

    function renderCurrentStep() {
        formContainer.innerHTML = "";

        if (currentFlow && currentStepIndex >= 0) {
            const contactTitle = document.createElement("h2");
            const selectedOption = initialStep.options.find(opt => opt.value === responses[initialStep.name]);
            contactTitle.textContent = selectedOption ? selectedOption.label : "";
            formContainer.appendChild(contactTitle);
        }

        const inlineContainer = document.createElement("div");
        inlineContainer.className = "question-answer-inline";

        const label = document.createElement("label");
        label.textContent = currentFlow.steps[currentStepIndex].question;
        inlineContainer.appendChild(label);

        const step = currentFlow.steps[currentStepIndex];
        let answerElement;
        if (step.type === "radio") {
            answerElement = document.createElement("div");
            answerElement.className = "options";
            step.options.forEach(opt => {
                const radioLabel = document.createElement("label");
                radioLabel.style.marginRight = "15px";
                const radioInput = document.createElement("input");
                radioInput.type = "radio";
                radioInput.name = step.name;
                radioInput.value = opt;
                if (responses[step.name] === opt) {
                    radioInput.checked = true;
                }
                radioLabel.appendChild(radioInput);
                radioLabel.appendChild(document.createTextNode(" " + opt));
                answerElement.appendChild(radioLabel);
            });
        } else if (step.type === "select") {
            answerElement = document.createElement("select");
            answerElement.name = step.name;
            step.options.forEach(opt => {
                const option = document.createElement("option");
                option.value = opt;
                option.textContent = opt;
                if (responses[step.name] === opt) {
                    option.selected = true;
                }
                answerElement.appendChild(option);
            });
        } else if (step.type === "textarea") {
            answerElement = document.createElement("textarea");
            answerElement.name = step.name;
            if (responses[step.name]) {
                answerElement.value = responses[step.name];
            }
            answerElement.style.height = "40px";
        } else {
            answerElement = document.createElement("input");
            answerElement.type = step.type;
            answerElement.name = step.name;
            if (responses[step.name]) {
                answerElement.value = responses[step.name];
            }
        }

        inlineContainer.appendChild(answerElement);
        const stepDiv = document.createElement("div");
        stepDiv.className = "form-step";
        stepDiv.appendChild(inlineContainer);
        formContainer.appendChild(stepDiv);
        formContainer.appendChild(createProgressBar());
        renderNavigationButtons();
    }

    function renderNavigationButtons() {
        if (currentStepIndex === -1) return;
        const navDiv = document.createElement("div");
        navDiv.className = "navigation-buttons";

        const nextButton = document.createElement("button");
        nextButton.textContent = currentStepIndex === (currentFlow.steps.length - 1) ? "Submit" : "Next";
        nextButton.style.animationDelay = "0.2s";
        nextButton.addEventListener("click", () => {
            if (!saveResponse()) return;
            if (currentStepIndex < currentFlow.steps.length - 1) {
                currentStepIndex++;
                renderCurrentStep();
            } else {
                submitForm();
            }
        });
        navDiv.appendChild(nextButton);

        const backButton = document.createElement("button");
        backButton.textContent = "Back";
        backButton.style.animationDelay = "0.4s";
        backButton.addEventListener("click", () => {
            if (currentStepIndex === 0) {
                renderInitialStep();
            } else {
                currentStepIndex--;
                renderCurrentStep();
            }
        });
        navDiv.appendChild(backButton);
        formContainer.appendChild(navDiv);
    }

    function saveResponse() {
        if (currentStepIndex === -1) return true;
        const step = currentFlow.steps[currentStepIndex];
        let value = "";
        if (step.type === "radio") {
            const selected = document.querySelector("input[name='" + step.name + "']:checked");
            if (!selected) {
                alert("Please select an option.");
                return false;
            }
            value = selected.value;
        } else {
            const inputElem = document.querySelector("[name='" + step.name + "']");
            if (!inputElem || inputElem.value.trim() === "") {
                alert("Please fill in this field.");
                return false;
            }
            value = inputElem.value.trim();
        }
        responses[step.name] = value;
        return true;
    }

    function submitForm() {
        const endpoint = currentFlow.endpoint;
        const data = {
            contactReason: responses["contactReason"],
            ...responses
        };
        fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
                alert("Thank you for contacting us. We will get back to you soon.");
                renderInitialStep();
            })
            .catch(error => {
                console.error("Error:", error);
                alert("There was an error submitting your form. Please try again later.");
            });
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            const nextBtn = document.querySelector(".navigation-buttons button:last-child");
            if (nextBtn) nextBtn.click();
        }
    });

    renderInitialStep();
})();
