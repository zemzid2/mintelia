/* ============================================================
   MINTELIA — POPUP.JS
   WhatsApp chat popup — appears after 30 seconds
   Add to every page before </body>:
   <script src="../styles/popup.js"></script>
   ============================================================ */

(function () {

  // ── CONFIG ──
  const PHONE = '923148310764';
  const DELAY = 15000; // 30 seconds time
  const MESSAGE = 'Hi Mintelia! I visited your website and I\'m interested in your furniture.';
  const STORAGE_KEY = 'mintelia_popup_shown';

  // Only show once per session
  if (sessionStorage.getItem(STORAGE_KEY)) return;

  // ── INJECT STYLES ──
  const style = document.createElement('style');
  style.textContent = `
    .wa-popup-overlay {
      position: fixed;
      inset: 0;
      z-index: 9998;
      pointer-events: none;
    }
    .wa-popup {
      position: fixed;
      bottom: 110px;
      right: 36px;
      z-index: 9999;
      width: 300px;
      background: var(--white, #FDFCFA);
      border: 0.5px solid rgba(26,26,23,0.15);
      box-shadow: 0 12px 48px rgba(0,0,0,0.15);
      transform: translateY(20px);
      opacity: 0;
      transition: transform 0.4s ease, opacity 0.4s ease;
      pointer-events: none;
    }
    .wa-popup.show {
      transform: translateY(0);
      opacity: 1;
      pointer-events: all;
    }
    .wa-popup-header {
      background: #25D366;
      padding: 16px 18px;
      display: flex;
      align-items: center;
      gap: 12px;
      position: relative;
    }
    .wa-popup-avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .wa-popup-avatar svg {
      width: 22px;
      height: 22px;
      fill: white;
    }
    .wa-popup-name {
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: white;
      margin-bottom: 2px;
    }
    .wa-popup-status {
      font-family: 'DM Sans', sans-serif;
      font-size: 11px;
      color: rgba(255,255,255,0.8);
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .wa-popup-status::before {
      content: '';
      display: block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #aef7c0;
    }
    .wa-popup-close {
      position: absolute;
      top: 10px;
      right: 12px;
      background: none;
      border: none;
      color: rgba(255,255,255,0.7);
      cursor: pointer;
      font-size: 18px;
      line-height: 1;
      padding: 0;
      transition: color 0.2s;
    }
    .wa-popup-close:hover { color: white; }
    .wa-popup-body {
      padding: 20px 18px;
      background: #f0f0f0;
    }
    .wa-popup-bubble {
      background: white;
      border-radius: 0 12px 12px 12px;
      padding: 12px 14px;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      font-weight: 300;
      color: #1A1A17;
      line-height: 1.6;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
      margin-bottom: 6px;
      position: relative;
    }
    .wa-popup-time {
      font-size: 10px;
      color: #999;
      text-align: right;
    }
    .wa-popup-footer {
      padding: 14px 18px;
      background: var(--white, #FDFCFA);
      border-top: 0.5px solid rgba(26,26,23,0.08);
    }
    .wa-popup-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 13px;
      background: #25D366;
      color: white;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.04em;
      text-decoration: none;
      border: none;
      cursor: pointer;
      transition: background 0.2s;
    }
    .wa-popup-btn:hover { background: #1abe58; }
    .wa-popup-btn svg { width: 18px; height: 18px; fill: white; flex-shrink: 0; }
    .wa-popup-dismiss {
      display: block;
      text-align: center;
      font-family: 'DM Sans', sans-serif;
      font-size: 11px;
      color: #999;
      margin-top: 10px;
      cursor: pointer;
      background: none;
      border: none;
      width: 100%;
      transition: color 0.2s;
    }
    .wa-popup-dismiss:hover { color: #666; }
  `;
  document.head.appendChild(style);

  // ── BUILD POPUP ──
  function buildPopup() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeStr = (hours % 12 || 12) + ':' + String(minutes).padStart(2, '0') + (hours >= 12 ? ' PM' : ' AM');

    const popup = document.createElement('div');
    popup.className = 'wa-popup';
    popup.id = 'waPopup';
    popup.innerHTML = `
      <div class="wa-popup-header">
        <div class="wa-popup-avatar">
          <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
        </div>
        <div>
          <div class="wa-popup-name">Mintelia</div>
          <div class="wa-popup-status">Typically replies instantly</div>
        </div>
        <button class="wa-popup-close" onclick="closeWaPopup()">✕</button>
      </div>
      <div class="wa-popup-body">
        <div class="wa-popup-bubble">
          👋 Hi there! Looking for premium custom furniture?<br><br>
          We'd love to help you find the perfect piece for your space.
        </div>
        <div class="wa-popup-time">${timeStr}</div>
      </div>
      <div class="wa-popup-footer">
        <a href="https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}" class="wa-popup-btn" target="_blank">
          <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          Start Chat on WhatsApp
        </a>
        <button class="wa-popup-dismiss" onclick="closeWaPopup()">Maybe later</button>
      </div>
    `;
    document.body.appendChild(popup);

    // Show with animation
    setTimeout(() => popup.classList.add('show'), 100);
  }

  // ── CLOSE ──
  window.closeWaPopup = function () {
    const popup = document.getElementById('waPopup');
    if (popup) {
      popup.classList.remove('show');
      setTimeout(() => popup.remove(), 400);
    }
    sessionStorage.setItem(STORAGE_KEY, '1');
  };

  // ── TRIGGER AFTER DELAY ──
  setTimeout(buildPopup, DELAY);

})();
