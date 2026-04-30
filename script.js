document.addEventListener("DOMContentLoaded", () => {
  // 📁 Folder toggles
  const toggles = document.querySelectorAll('.folder-toggle');
  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const content = btn.nextElementSibling;
      content.style.display = content.style.display === 'block' ? 'none' : 'block';
    });
  });

  // 🖥️ Terminal logic
  const terminalBtn = document.querySelector('.terminal-toggle');
  const terminal = document.getElementById('terminalWindow');
  const closeTerminal = document.getElementById('closeTerminal');
  const input = document.getElementById('terminalInput');
  const output = document.getElementById('terminalOutput');

  if (terminalBtn && terminal) {
    terminalBtn.addEventListener('click', () => {
      terminal.style.display = 'flex';
      input.focus();
    });
  }

  if (closeTerminal && terminal) {
    closeTerminal.addEventListener('click', () => {
      terminal.style.display = 'none';
      output.innerHTML = '';
    });
  }

  if (input && output) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = input.value.trim();
        output.innerHTML += `<div>> ${cmd}</div>`;
        input.value = '';
        handleCommand(cmd.toLowerCase());
        output.scrollTop = output.scrollHeight;
      }
    });
  }

  function handleCommand(cmd) {
    const cleaned = cmd.trim().toLowerCase();

    const respond = (text) => print(text);

    // Fuzzy matching groups
    const isAbout = /^(about|who are you|tell me about|abt|bio|summary)$/i.test(cleaned);
    const isSkills = /^(skills?|what can you do|abilities|stack|tech)$/i.test(cleaned);
    const isProjects = /^(projects?|proj|show projects|work)$/i.test(cleaned);
    const isExperience = /^(experience|exp|jobs?|work history|career)$/i.test(cleaned);
    const isEducation = /^(education|edu|school|college|university)$/i.test(cleaned);
    const isContact = /^(contact|email|reach|links)$/i.test(cleaned);
    const isClear = /^(clear|cls)$/i.test(cleaned);
    const isHelp = /^(help|\?)$/i.test(cleaned);

    // Easter eggs
    if (cleaned === "hi" || cleaned === "hello") {
      return respond("👋 Hey! I'm Rohan — try 'about', 'experience', 'skills', or 'projects'");
    }

    if (cleaned === "exit") {
      return respond("You can't escape me that easily 😈");
    }

    if (cleaned === "exora") {
      return respond("🌍 Exora — a social travel platform I co-founded.\n200K+ impressions, 500+ waitlist users, 15+ events across Delhi & Goa.");
    }

    if (isClear) {
      output.innerHTML = '';
      return;
    }

    if (isAbout) {
      return respond(`Second-year CS undergrad at DTU building production-grade AI systems — agentic LLM pipelines, serverless deployments, and fine-tuned NLP models.\nSeeking AI/ML engineering or product development roles.\nTry 'experience' or 'projects'`);
    }

    if (isSkills) {
      return respond(`Languages: Python, C, C++, SQL, JavaScript, HTML\nAI/ML: Machine Learning, NLP, Transformers, LangChain, Langgraph, Hugging Face, RAG, VectorDB\nFrameworks: FastAPI, Streamlit, Playwright, Selenium, Firecrawl, Next.js\nCloud: AWS Lambda, Apps Script, OpenRouter, GCP, Docker, CI/CD`);
    }

    if (isExperience) {
      return respond(`💼 Experience:\n• Exora — Co-Founder (Oct 2025 – Present)\n  Social travel platform, 200K+ impressions, 15+ events\n• RevopsAgent — AI & Automation Intern (Jun – Sep 2025)\n  Built AI tools platform, scaled LLM pipelines, deployed AWS Lambda\n• National Youth Council Singapore — Tech Apprentice (2024)\n  AI/CV curriculum, 2 prototypes`);
    }

    if (isProjects) {
      return respond(`📁 Projects:\n• Agentic Arbitrage Engine (🏆 2nd Prize, 0xGenIgnite)\n• Product Review Sentiment Analyzer (91% accuracy)\n• AI-Driven Procurement Audit & Supplier Intelligence\n• AI-Powered Lead Enrichment Agent (10× speedup)`);
    }

    if (isEducation) {
      return respond(`🎓 Delhi Technological University (DTU)\nB.Tech in Computer Science — 2024 to 2028\nDelhi, India`);
    }

    if (isContact) {
      return respond(`✉️ justrohan29@gmail.com\n🔗 github.com/justrohan29\n🔗 linkedin.com/in/rohnis\n📍 Delhi, India`);
    }

    if (isHelp) {
      return respond(`Available commands:\n- about / summary\n- skills / stack\n- experience / exp\n- projects / work\n- education / edu\n- contact / email\n- exora\n- clear\n- help`);
    }

    return respond("🤖 Unknown command. Try 'help' for a list of valid commands.");
  }


  function print(text) {
    output.innerHTML += `<div>${text.replace(/\n/g, "<br>")}</div>`;
  }

  // 📝 Draggable Notepad
  const notepad = document.getElementById('notepadWindow');
  const closeNotepad = document.getElementById('closeNotepad');
  if (notepad && closeNotepad) {
    closeNotepad.addEventListener('click', () => {
      notepad.style.display = 'none';
    });
    dragElement(notepad, document.getElementById('notepadHeader'));
  }

  // 🌐 iFrame Project Viewer
  const iframeWindow = document.getElementById('iframeWindow');
  const iframeContent = document.getElementById('iframeContent');
  const iframeClose = document.getElementById('iframeClose');
  const iframeHeader = document.getElementById('iframeHeader');
  const iframeTitle = document.getElementById('iframeTitle');

  document.querySelectorAll('.iframe-link').forEach(link => {
    link.style.cursor = 'pointer';
    link.style.textDecoration = 'underline';
    link.addEventListener('click', () => {
      const url = link.dataset.url;
      const title = link.innerText || "🌐 Link Viewer";
      if (!url) return alert('Link not available.');
      iframeContent.src = url;
      iframeTitle.innerText = title;
      iframeWindow.style.display = 'flex';
    });
  });

  iframeClose.addEventListener('click', () => {
    iframeWindow.style.display = 'none';
    iframeContent.src = '';
    iframeTitle.innerText = "🌐 Link Viewer";
  });

  dragElement(iframeWindow, iframeHeader);

  // 🧲 Draggable logic
  function dragElement(elmnt, header) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    header.onmousedown = e => {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = () => {
        document.onmouseup = null;
        document.onmousemove = null;
      };
      document.onmousemove = e => {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = elmnt.offsetTop - pos2 + "px";
        elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
      };
    };
  }
}); 

const resumeToggle = document.querySelector('.resume-toggle');
const resumeWindow = document.getElementById('resumeWindow');
const resumeHeader = document.getElementById('resumeHeader');
const resumeClose = document.getElementById('resumeClose');

// Show/hide resume window
resumeToggle.addEventListener('click', () => {
  resumeWindow.style.display = 'flex';
});

resumeClose.addEventListener('click', () => {
  resumeWindow.style.display = 'none';
});

// Make resume window draggable
let isDraggingResume = false, resumeOffsetX, resumeOffsetY;

resumeHeader.addEventListener('mousedown', (e) => {
  isDraggingResume = true;
  const rect = resumeWindow.getBoundingClientRect();
  resumeOffsetX = e.clientX - rect.left;
  resumeOffsetY = e.clientY - rect.top;
});

document.addEventListener('mousemove', (e) => {
  if (isDraggingResume) {
    resumeWindow.style.left = `${e.clientX - resumeOffsetX}px`;
    resumeWindow.style.top = `${e.clientY - resumeOffsetY}px`;
  }
});

document.addEventListener('mouseup', () => {
  isDraggingResume = false;
});

function makeDraggable(headerId, windowId) {
  const header = document.getElementById(headerId);
  const windowEl = document.getElementById(windowId);
  let offsetX = 0, offsetY = 0, isDragging = false;

  header.onmousedown = (e) => {
    isDragging = true;
    offsetX = e.clientX - windowEl.offsetLeft;
    offsetY = e.clientY - windowEl.offsetTop;
    document.onmousemove = drag;
    document.onmouseup = stopDrag;
  };

  function drag(e) {
    if (!isDragging) return;
    windowEl.style.left = (e.clientX - offsetX) + "px";
    windowEl.style.top = (e.clientY - offsetY) + "px";
  }

  function stopDrag() {
    isDragging = false;
    document.onmousemove = null;
    document.onmouseup = null;
  }
}

makeDraggable("terminalHeader", "terminalWindow");
