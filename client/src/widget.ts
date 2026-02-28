// client/src/widget.ts
// A framework-agnostic vanilla JS Web Component for TechPartner

class TechPartnerWidget extends HTMLElement {
  constructor() {
    super();
    // Shadow DOM prevents the host website's CSS from breaking your widget
    const shadow = this.attachShadow({ mode: 'open' });
    
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <style>
        .widget-box { 
          padding: 15px; 
          border-radius: 8px; 
          border: 1px solid #01A1C1; 
          font-family: system-ui, -apple-system, sans-serif;
          background: white;
          max-width: 300px;
        }
        .widget-title {
          color: #01A1C1;
          margin: 0 0 10px 0;
          font-size: 16px;
          font-weight: 600;
        }
        .widget-content {
          color: #333;
          font-size: 14px;
          margin-bottom: 10px;
        }
        .footer-link { 
          font-size: 11px; 
          color: #666; 
          text-decoration: none; 
          display: block; 
          margin-top: 10px;
          text-align: right;
        }
        .footer-link:hover {
          color: #01A1C1;
        }
      </style>
      <div class="widget-box">
        <h3 class="widget-title">Live Coaching Timer</h3>
        <div class="widget-content">
          <div id="timer">00:00:00</div>
          <button id="startBtn" style="background: #01A1C1; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px;">Start</button>
          <button id="resetBtn" style="background: #ccc; color: #333; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Reset</button>
        </div>
        
        <a href="https://techpartner.sa/go/widget-timer" class="footer-link" target="_blank" rel="dofollow">
          Powered by TechPartner Engineering
        </a>
      </div>
    `;
    
    shadow.appendChild(wrapper);
    
    // Add timer functionality
    let seconds = 0;
    let interval: number | null = null;
    const timerDisplay = shadow.getElementById('timer');
    const startBtn = shadow.getElementById('startBtn');
    const resetBtn = shadow.getElementById('resetBtn');
    
    const formatTime = (secs: number) => {
      const h = Math.floor(secs / 3600).toString().padStart(2, '0');
      const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
      const s = (secs % 60).toString().padStart(2, '0');
      return `${h}:${m}:${s}`;
    };
    
    startBtn?.addEventListener('click', () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
        startBtn.textContent = 'Start';
      } else {
        interval = window.setInterval(() => {
          seconds++;
          if (timerDisplay) {
            timerDisplay.textContent = formatTime(seconds);
          }
        }, 1000);
        startBtn.textContent = 'Pause';
      }
    });
    
    resetBtn?.addEventListener('click', () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      seconds = 0;
      if (timerDisplay) {
        timerDisplay.textContent = '00:00:00';
      }
      if (startBtn) {
        startBtn.textContent = 'Start';
      }
    });
  }
}

customElements.define('techpartner-widget', TechPartnerWidget);

// Export for module systems
export { TechPartnerWidget };
