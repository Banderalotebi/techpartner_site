// widgets/astrolabe.ts - The Digital Astrolabe (Trojan Horse Widget)
// Embeddable widget for backlink generation - other sites embed this for free SEO value

class DigitalAstrolabe extends HTMLElement {
    private jeddahLat = 21.5433;
    private jeddahLon = 39.1728;
    private intervalId: number | null = null;
    private apiKey: string | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.apiKey = this.getAttribute('api-key') || null;
    }

    connectedCallback() {
        this.render();
        this.startTriangulation();
    }

    disconnectedCallback() {
        if (this.intervalId) clearInterval(this.intervalId);
    }

    private async fetchLiveLunarData() {
        try {
            // Using AstronomyAPI or similar service
            // For demo, we'll use calculated positions based on time
            const now = new Date();
            
            // Calculate moon position (simplified algorithm)
            const daysSinceNewMoon = (now.getTime() - new Date('2024-01-11').getTime()) / (1000 * 60 * 60 * 24);
            const lunarAge = daysSinceNewMoon % 29.53;
            const phase = (lunarAge / 29.53) * 360;
            
            // Calculate altitude based on time of day (simplified)
            const hour = now.getHours() + now.getMinutes() / 60;
            const hourAngle = (hour - 12) * 15; // 15 degrees per hour from solar noon
            
            // Convert to radians
            const rad = (deg: number) => deg * (Math.PI / 180);
            
            // Simplified lunar declination calculation
            const declination = 23.5 * Math.sin(rad(phase));
            
            // Calculate altitude using spherical trig
            const sinAltitude = 
                (Math.sin(rad(this.jeddahLat)) * Math.sin(rad(declination))) + 
                (Math.cos(rad(this.jeddahLat)) * Math.cos(rad(declination)) * Math.cos(rad(hourAngle)));
                
            const altitude = Math.asin(sinAltitude) * (180 / Math.PI);
            
            // Update display
            const altElement = this.shadowRoot?.querySelector('#lunar-alt');
            const timeElement = this.shadowRoot?.querySelector('#lunar-time');
            const phaseElement = this.shadowRoot?.querySelector('#lunar-phase');
            
            if (altElement) altElement.textContent = `${altitude.toFixed(2)}°`;
            if (timeElement) timeElement.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            if (phaseElement) phaseElement.textContent = this.getMoonPhaseName(lunarAge);

        } catch (error) {
            console.error("Astrolabe Error:", error);
            const altElement = this.shadowRoot?.querySelector('#lunar-alt');
            if (altElement) altElement.textContent = "Signal Lost";
        }
    }

    private getMoonPhaseName(age: number): string {
        if (age < 1) return "New Moon";
        if (age < 7) return "Waxing Crescent";
        if (age < 8) return "First Quarter";
        if (age < 14) return "Waxing Gibbous";
        if (age < 16) return "Full Moon";
        if (age < 22) return "Waning Gibbous";
        if (age < 23) return "Last Quarter";
        if (age < 29) return "Waning Crescent";
        return "New Moon";
    }

    private startTriangulation() {
        this.fetchLiveLunarData();
        this.intervalId = window.setInterval(() => {
            this.fetchLiveLunarData();
        }, 60000); // Update every minute
    }

    private render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: 'Courier New', Courier, monospace;
                }
                
                .astrolabe-container {
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    color: #e2e8f0;
                    padding: 20px;
                    border-radius: 12px;
                    border: 1px solid #38bdf8;
                    width: 100%;
                    max-width: 320px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.5), 0 0 20px rgba(56, 189, 248, 0.1);
                    position: relative;
                    overflow: hidden;
                }
                
                .astrolabe-container::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(56, 189, 248, 0.03) 0%, transparent 70%);
                    pointer-events: none;
                }
                
                .header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 16px;
                    font-size: 14px;
                    font-weight: bold;
                    color: #fff;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                
                .header-icon {
                    width: 20px;
                    height: 20px;
                    color: #38bdf8;
                }
                
                .data-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                    padding-bottom: 8px;
                    border-bottom: 1px dashed rgba(51, 65, 85, 0.5);
                }
                
                .data-label {
                    font-size: 12px;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .data-value {
                    font-size: 14px;
                    font-weight: bold;
                    color: #38bdf8;
                    font-family: 'Courier New', monospace;
                }
                
                .phase-indicator {
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: #fbbf24;
                    margin-left: 8px;
                    box-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
                }
                
                .footer {
                    margin-top: 16px;
                    padding-top: 12px;
                    border-top: 1px solid rgba(51, 65, 85, 0.5);
                    font-size: 11px;
                    text-align: right;
                    font-family: system-ui, -apple-system, sans-serif;
                }
                
                .footer a {
                    color: #64748b;
                    text-decoration: none;
                    transition: color 0.2s;
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                }
                
                .footer a:hover {
                    color: #38bdf8;
                }
                
                .footer a::after {
                    content: '↗';
                    font-size: 10px;
                }
                
                .live-indicator {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 10px;
                    color: #22c55e;
                    margin-left: auto;
                }
                
                .live-dot {
                    width: 6px;
                    height: 6px;
                    background: #22c55e;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                
                .coordinates {
                    font-size: 10px;
                    color: #475569;
                    margin-top: 4px;
                }
            </style>

            <div class="astrolabe-container">
                <div class="header">
                    <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                        <path d="M2 12h20"/>
                    </svg>
                    Lunar Triangulation
                    <span class="live-indicator">
                        <span class="live-dot"></span>
                        LIVE
                    </span>
                </div>
                
                <div class="data-row">
                    <span class="data-label">Base Coordinates</span>
                    <span class="data-value">${this.jeddahLat}°N, ${this.jeddahLon}°E</span>
                </div>
                
                <div class="data-row">
                    <span class="data-label">Local Time (AST)</span>
                    <span class="data-value" id="lunar-time">--:--</span>
                </div>
                
                <div class="data-row">
                    <span class="data-label">Lunar Altitude</span>
                    <span class="data-value" id="lunar-alt">--°</span>
                </div>
                
                <div class="data-row" style="border-bottom: none; margin-bottom: 0;">
                    <span class="data-label">Moon Phase</span>
                    <span class="data-value">
                        <span id="lunar-phase">--</span>
                        <span class="phase-indicator"></span>
                    </span>
                </div>

                <div class="footer">
                    <a href="https://techpartner.sa/labs/astrolabe" target="_blank" rel="dofollow">
                        Widget by TechPartner Engineering
                    </a>
                </div>
            </div>
        `;
    }
}

// Register the custom element
customElements.define('digital-astrolabe', DigitalAstrolabe);

// Auto-initialize if script is loaded
console.log('🌙 Digital Astrolabe widget loaded - TechPartner Engineering');
