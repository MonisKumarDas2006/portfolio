/**
 * ==========================================================================
 * MONIS KUMAR DAS — PORTFOLIO MAIN JAVASCRIPT
 * Pure Vanilla JavaScript (Zero framework overhead, modular, accessible & performant)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScrollProgressAndSpy();
  initTypewriter();
  initSkillsFilter();
  initCertModal();
  initProjectModals();
  initTerminal();
  initClipboardAndToast();
  initContactForm();
  initMobileDrawer();
  initBackToTop();
  updateCurrentYear();
});

/* --------------------------------------------------------------------------
   1. Theme Switcher (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const htmlRoot = document.documentElement;

  const savedTheme = localStorage.getItem('mkd_portfolio_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'dark');

  htmlRoot.setAttribute('data-theme', initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('mkd_portfolio_theme', newTheme);

      showToast(`Switched to ${newTheme} theme`);
    });
  }
}

/* --------------------------------------------------------------------------
   2. Scroll Progress Bar, Sticky Header & Scrollspy Navigation
   -------------------------------------------------------------------------- */
function initScrollProgressAndSpy() {
  const progressBar = document.getElementById('scroll-progress');
  const siteHeader = document.getElementById('site-header');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('back-to-top-btn');

  function onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Progress Bar
    if (progressBar && scrollHeight > 0) {
      const progressPercent = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = `${progressPercent}%`;
    }

    // Header Elevation
    if (siteHeader) {
      if (scrollTop > 30) {
        siteHeader.classList.add('header-scrolled');
      } else {
        siteHeader.classList.remove('header-scrolled');
      }
    }

    // Scrollspy for active nav link
    let currentSectionId = '';
    const scrollOffset = scrollTop + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollOffset >= top && scrollOffset < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollTop > 400) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
      } else {
        backToTopBtn.style.opacity = '0.7';
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   3. Typewriter Effect
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const typewriterElem = document.getElementById('typewriter');
  if (!typewriterElem) return;

  const roles = [
    "Aspiring Machine Learning Engineer.",
    "B.Tech CSE (AI & ML) Student.",
    "C++ & Python Developer.",
    "Competitive Problem Solver.",
    "Curious Technology Builder."
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterElem.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typewriterElem.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80 + Math.random() * 40;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 1800;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* --------------------------------------------------------------------------
   4. Skills Category Filter
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skill-filter-tabs .filter-btn');
  const skillCards = document.querySelectorAll('#skills-container .skill-card');

  if (!filterBtns.length || !skillCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Certificate Lightbox Modal (Image & PDF Previewer)
   -------------------------------------------------------------------------- */
function initCertModal() {
  const modal = document.getElementById('cert-modal');
  const modalTitle = document.getElementById('cert-modal-title');
  const modalId = document.getElementById('cert-modal-id');
  const modalBody = document.getElementById('cert-modal-body');
  const modalDownload = document.getElementById('cert-modal-download');
  const closeBtn = document.getElementById('cert-modal-close');
  const closeFooterBtn = document.getElementById('cert-modal-close-btn');
  const previewBtns = document.querySelectorAll('.preview-cert-btn');

  if (!modal) return;

  function openModal(title, src, type, id) {
    if (modalTitle) modalTitle.textContent = title || 'Certificate Preview';
    if (modalId) modalId.textContent = id ? `Certificate ID: ${id}` : '';
    if (modalDownload) modalDownload.href = src;

    if (modalBody) {
      modalBody.innerHTML = '';
      if (type === 'pdf') {
        const iframe = document.createElement('iframe');
        iframe.src = src;
        iframe.className = 'pdf-preview-box';
        iframe.title = title || 'PDF Certificate';
        modalBody.appendChild(iframe);
      } else {
        const img = document.createElement('img');
        img.src = src;
        img.alt = title || 'Certificate Document';
        img.className = 'modal-preview-img';
        img.loading = 'lazy';
        modalBody.appendChild(img);
      }
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (modalBody) {
      setTimeout(() => { modalBody.innerHTML = ''; }, 300);
    }
  }

  previewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-cert-title');
      const src = btn.getAttribute('data-cert-src');
      const type = btn.getAttribute('data-cert-type') || 'image';
      const id = btn.getAttribute('data-cert-id') || '';
      openModal(title, src, type, id);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (closeFooterBtn) closeFooterBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   6. Project Detail Modals
   -------------------------------------------------------------------------- */
function initProjectModals() {
  const projectModals = document.querySelectorAll('.project-modal');
  const openBtns = document.querySelectorAll('[data-modal]');
  const closeBtns = document.querySelectorAll('.project-modal-close');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetModalId = btn.getAttribute('data-modal');
      const targetModal = document.getElementById(targetModalId);
      if (targetModal) {
        targetModal.classList.add('open');
        targetModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectModals.forEach(modal => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      });
      document.body.style.overflow = '';
    });
  });

  projectModals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      projectModals.forEach(modal => {
        if (modal.classList.contains('open')) {
          modal.classList.remove('open');
          modal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      });
    }
  });
}

/* --------------------------------------------------------------------------
   7. Interactive Terminal Playground ("Monis CLI")
   -------------------------------------------------------------------------- */
function initTerminal() {
  const terminalInput = document.getElementById('terminal-input');
  const terminalBody = document.getElementById('terminal-body');
  const clearBtn = document.getElementById('terminal-clear-btn');
  const cmdChips = document.querySelectorAll('.cmd-chip');

  if (!terminalInput || !terminalBody) return;

  const commandHistory = [];
  let historyIndex = -1;

  const commands = {
    help: () => `Available commands:
  • <strong class="text-cyan">bio</strong>        : Summary of Monis's background and focus
  • <strong class="text-cyan">skills</strong>     : Core languages, web technologies, and tooling
  • <strong class="text-cyan">projects</strong>   : Featured engineering and AI projects
  • <strong class="text-cyan">education</strong>  : Academic history and credentials
  • <strong class="text-cyan">certs</strong>      : Verified certifications & accreditations
  • <strong class="text-cyan">socials</strong>    : GitHub, LinkedIn, and LeetCode profiles
  • <strong class="text-cyan">contact</strong>    : Direct email and phone number
  • <strong class="text-cyan">clear</strong>      : Clear the terminal screen
  • <strong class="text-cyan">date</strong>       : Display current system time`,

    bio: () => `Monis Kumar Das
Role: B.Tech CSE (AI & ML) 2nd Year Student
Institution: Lovely Professional University (Punjab, India)
Aspiration: Machine Learning Engineer & Systems Developer
Focus: Merging strong C++/Python fundamentals with applied AI logic.`,

    skills: () => `Technical Arsenal:
  [Languages]   : Python (Active Focus), C++ (Saylor Certified), C (Fundamentals)
  [Web Tech]    : HTML5, CSS3 (Tokens/Responsive), JavaScript (ES6+)
  [Databases]   : MySQL, Relational Database Modeling
  [Tools]       : Git, GitHub, VS Code, Linux Shell
  [Soft Skills] : Problem Solving, Mentorship (WNS CyberSmart), Time Management`,

    projects: () => `Featured Engineered Projects:
  1. CureConnect          : AI-Driven Healthcare Navigation & Early Risk Triage Platform
  2. Self-Watering Planter: Smart Agro-Climatic Sub-Irrigation & Soil Moisture Automation
  3. Women Safety System  : Real-Time Threat Analytics & Emergency Telemetry Framework`,

    education: () => `Academic Credentials:
  • Lovely Professional University (2024 - Present): B.Tech CSE AI & ML
  • Modern Public School (Class 12): Senior Secondary — 89.0%
  • Modern Public School (Class 10): Secondary — 89.8%`,

    certs: () => `Verified Certifications:
  1. CS107: C++ Programming (Saylor Academy) — ID: 6885105048MD
  2. Cyber Security Awareness Volunteer (WNS Cares Foundation) — ID: MONINDODI4D7DBAVONOTH
  3. Effective Time Management MOOC (Tech Veda) — ID: TV/OCT25/ETM/A1960
  4. CodeXtreme Top 30 Finalist (NeoColab) — Top 30 Coding Assessment
  5. Computer Programming CSE101 (NeoColab) — Certified Distinction`,

    socials: () => `Connect Online:
  • GitHub   : https://github.com/MonisKumarDas2006
  • LinkedIn : https://www.linkedin.com/in/monis-kumar-das-b780b8393/
  • LeetCode : https://leetcode.com/u/MonisKumarDas2006/`,

    contact: () => `Direct Contact Channels:
  • Email : monisdas2006@gmail.com
  • Phone : +91 8117070780
  • Base  : Lovely Professional University, Punjab, India`,

    whoami: () => `visitor@monis-portfolio-guest-session`,
    date: () => `Current Local Time: ${new Date().toString()}`,
    sudo: () => `Permission denied: Monis already has full root privileges.`
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    commandHistory.push(rawCmd);
    historyIndex = commandHistory.length;

    // Echo user input
    const userLine = document.createElement('div');
    userLine.className = 'terminal-line';
    userLine.innerHTML = `<span class="terminal-prompt">monis@portfolio:~$</span> <span class="terminal-cmd-entry">${escapeHtml(rawCmd)}</span>`;
    terminalBody.appendChild(userLine);

    // Handle clear
    if (cmd === 'clear') {
      terminalBody.innerHTML = '';
      return;
    }

    // Process output
    const outputLine = document.createElement('div');
    outputLine.className = 'terminal-line';

    if (commands[cmd]) {
      outputLine.innerHTML = commands[cmd]();
    } else {
      outputLine.innerHTML = `<span style="color: #F87171;">Command not found: "${escapeHtml(rawCmd)}". Type <strong class="text-cyan">help</strong> for available commands.</span>`;
    }

    terminalBody.appendChild(outputLine);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = terminalInput.value;
      terminalInput.value = '';
      executeCommand(val);
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex] || '';
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex] || '';
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
      e.preventDefault();
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      terminalBody.innerHTML = '';
      showToast('Terminal cleared');
    });
  }

  cmdChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
      }
    });
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* --------------------------------------------------------------------------
   8. Clipboard Copy & Toast Notifications
   -------------------------------------------------------------------------- */
function initClipboardAndToast() {
  const copyHeroBtn = document.getElementById('copy-email-hero-btn');
  const channelCopyBtns = document.querySelectorAll('.channel-copy-btn');

  if (copyHeroBtn) {
    copyHeroBtn.addEventListener('click', () => {
      const email = copyHeroBtn.getAttribute('data-email') || 'monisdas2006@gmail.com';
      copyToClipboard(email, 'Email copied to clipboard!');
    });
  }

  channelCopyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const copyVal = btn.getAttribute('data-copy');
      if (copyVal) {
        copyToClipboard(copyVal, `Copied: ${copyVal}`);
      }
    });
  });
}

function copyToClipboard(text, successMsg) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
    }).catch(() => {
      fallbackCopy(text, successMsg);
    });
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(successMsg);
  } catch (err) {
    showToast(`Value: ${text}`);
  }
  document.body.removeChild(textArea);
}

let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');

  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* --------------------------------------------------------------------------
   9. Contact Form Client Validation & Interaction
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    if (nameError) nameError.textContent = '';
    if (emailError) emailError.textContent = '';
    if (messageError) messageError.textContent = '';
    if (feedback) {
      feedback.className = 'form-feedback';
      feedback.textContent = '';
    }

    if (!nameInput.value.trim()) {
      if (nameError) nameError.textContent = 'Please enter your name.';
      isValid = false;
    }

    if (!emailInput.value.trim()) {
      if (emailError) emailError.textContent = 'Please enter your email address.';
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      if (emailError) emailError.textContent = 'Please provide a valid email format.';
      isValid = false;
    }

    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      if (messageError) messageError.textContent = 'Please write a message with at least 10 characters.';
      isValid = false;
    }

    if (!isValid) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending Message...</span>`;
    }

    setTimeout(() => {
      const name = nameInput.value.trim();
      const subject = subjectInput ? subjectInput.value.trim() || 'Portfolio Inquiry' : 'Portfolio Inquiry';
      const body = messageInput.value.trim();

      const mailtoLink = `mailto:monisdas2006@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name}\n\n${body}`)}`;

      if (feedback) {
        feedback.className = 'form-feedback success';
        feedback.innerHTML = `
          <strong>Thank you, ${escapeHtml(name)}!</strong><br>
          Your message has been prepared. If your mail client didn't open automatically, you can also 
          <a href="${mailtoLink}" style="text-decoration: underline; color: inherit; font-weight: bold;">click here to send directly via email client</a>.
        `;
      }

      showToast('Message ready! Opening email client...');

      window.location.href = mailtoLink;
      form.reset();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>Send Message</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
        `;
      }
    }, 600);
  });
}

/* --------------------------------------------------------------------------
   10. Mobile Drawer Navigation
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !drawer) return;

  function toggleMenu() {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    drawer.classList.add('open');
    menuBtn.classList.add('active');
    menuBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    drawer.classList.remove('open');
    menuBtn.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
  }

  menuBtn.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !menuBtn.contains(e.target)) {
      closeMenu();
    }
  });
}

/* --------------------------------------------------------------------------
   11. Back to Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   12. Current Year
   -------------------------------------------------------------------------- */
function updateCurrentYear() {
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
}
