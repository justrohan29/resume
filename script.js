document.addEventListener("DOMContentLoaded", () => {
  // 📁 Folder toggles
  document.querySelectorAll('.folder-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const content = btn.nextElementSibling;
      content.style.display = content.style.display === 'block' ? 'none' : 'block';
    });
  });

  // 🖥️ Terminal elements
  const terminalBtn = document.querySelector('.terminal-toggle');
  const terminal = document.getElementById('terminalWindow');
  const closeTerminal = document.getElementById('closeTerminal');
  const input = document.getElementById('terminalInput');
  const output = document.getElementById('terminalOutput');

  terminalBtn?.addEventListener('click', () => {
    terminal.style.display = 'flex';
    input.focus();
  });

  closeTerminal?.addEventListener('click', () => {
    terminal.style.display = 'none';
    output.innerHTML = '';
  });

  input?.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim();
      if (!cmd) return;

      print(`> ${cmd}`);
      input.value = '';
      const res = await queryGemini(cmd);
      print(res);
      output.scrollTop = output.scrollHeight;
    }
  });

  async function queryGemini(userInput) {
    try {
      const response = await fetch('/.netlify/functions/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `You are Rohan's AI terminal assistant. You know everything about him. User input: ${userInput}`
        })
      });
      const data = await response.json();
      return data.reply || '⚠️ No response from LLM.';
    } catch (err) {
      return '❌ Error contacting Gemini API.';
    }
  }

  function print(text) {
    output.innerHTML += `<div>${text.replace(/\n/g, "<br>")}</div>`;
  }

  // 📄 Resume Viewer
  const resumeToggle = document.querySelector('.resume-toggle');
  const resumeWindow = document.getElementById('resumeWindow');
  const resumeHeader = document.getElementById('resumeHeader');
  const resumeClose = document.getElementById('resumeClose');

  resumeToggle?.addEventListener('click', () => resumeWindow.style.display = 'flex');
  resumeClose?.addEventListener('click', () => resumeWindow.style.display = 'none');

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
      if (!url) return alert('Link not available.');
      iframeContent.src = url;
      iframeTitle.innerText = link.innerText || "🌐 Link Viewer";
      iframeWindow.style.display = 'flex';
    });
  });

  iframeClose?.addEventListener('click', () => {
    iframeWindow.style.display = 'none';
    iframeContent.src = '';
    iframeTitle.innerText = "🌐 Link Viewer";
  });

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

  dragElement(resumeWindow, resumeHeader);
  dragElement(iframeWindow, iframeHeader);
  dragElement(terminal, document.getElementById('terminalHeader'));
});
