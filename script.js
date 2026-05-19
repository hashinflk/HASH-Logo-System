document.addEventListener('DOMContentLoaded', () => {
    // 0. Access Control Logic
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const clientNameParam = urlParams.get('client');
    
    const overlay = document.getElementById('access-overlay');
    
    if (!token || token.trim() === '') {
        // No token, access denied
        overlay.style.display = 'flex';
        // Let the rest of the initialization run so the UI populates behind the blur
    } else {
        // Access granted
        overlay.style.display = 'none';
        
        // Update client config if passed in URL
        if (clientNameParam) {
            config.clientName = decodeURIComponent(clientNameParam);
            document.title = `${config.clientName} | Hash iNfinite Design`;
        }

        // Apply custom colors from admin if they exist in URL
        const c1 = urlParams.get('c1');
        const c2 = urlParams.get('c2');
        const c3 = urlParams.get('c3');
        const c4 = urlParams.get('c4');
        
        if (c1) config.colors[0].hex = '#' + c1;
        if (c2) config.colors[1].hex = '#' + c2;
        if (c3) config.colors[2].hex = '#' + c3;
        if (c4) config.colors[3].hex = '#' + c4;
    }

    // 1. Tab Switching Logic
    window.switchTab = function(tabId) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
        
        // Show selected tab
        document.getElementById(`tab-${tabId}`).classList.add('active');
        document.getElementById(`nav-${tabId}`).classList.add('active');
    };

    // Initialize state
    let selectedColor = config.colors[0];
    let selectedFont = config.fonts[0];

    const colorOptionsContainer = document.getElementById('color-options');
    const fontOptionsContainer = document.getElementById('font-options');
    
    // Disable Dragging on Images for protection
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', (e) => e.preventDefault());
    });

    // 2. Render Color Options (Logo Previewer)
    config.colors.forEach((color, index) => {
        const btn = document.createElement('div');
        btn.className = `option-pill ${index === 0 ? 'active' : ''}`;
        btn.dataset.colorId = color.id;
        
        btn.innerHTML = `
            <div class="icon-color" style="background-color: ${color.hex}"></div>
            <span class="option-text">${color.name}</span>
        `;
        
        btn.addEventListener('click', () => {
            document.querySelectorAll('#color-options .option-pill').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedColor = color;
            updatePreview();
        });
        
        colorOptionsContainer.appendChild(btn);
    });

    // 3. Render Font Options (Logo Previewer)
    config.fonts.forEach((font, index) => {
        const btn = document.createElement('div');
        btn.className = `option-pill ${index === 0 ? 'active' : ''}`;
        btn.dataset.fontId = font.id;
        
        btn.innerHTML = `
            <div class="icon"><i class="fa-solid fa-font"></i></div>
            <span class="option-text">${font.name}</span>
        `;
        
        btn.addEventListener('click', () => {
            document.querySelectorAll('#font-options .option-pill').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedFont = font;
            updatePreview();
        });
        
        fontOptionsContainer.appendChild(btn);
    });

    // 4. Update Image Preview and AI Description
    function updatePreview() {
        document.getElementById('current-color-name').textContent = selectedColor.name;
        document.getElementById('current-font-name').textContent = selectedFont.name;
        
        // Generate AI Description based on selections
        generateAIDescription(selectedColor, selectedFont);
        
        const loader = document.getElementById('loader');
        loader.classList.add('active');
        const previewImage = document.getElementById('logo-preview');
        
        const imagePath = `${config.imageFolder}logo-${selectedColor.id}-${selectedFont.id}${config.imageExtension}`;
        const tempImg = new Image();
        
        tempImg.onload = () => {
            previewImage.src = imagePath;
            loader.classList.remove('active');
        };
        
        tempImg.onerror = () => {
            // Fallback to SVG generator if actual image doesn't exist
            setTimeout(() => {
                const svgData = generateDemoLogoSVG(selectedColor, selectedFont);
                previewImage.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
                loader.classList.remove('active');
            }, 500);
        };
        
        tempImg.src = imagePath;
    }

    // Mock AI Description logic
    function generateAIDescription(color, font) {
        const templates = [
            `The visually striking ${color.name} hue beautifully complements the ${font.name} typography, resulting in a harmonious, modern aesthetic. This dynamic combination evokes a deep sense of trust and professionalism, ensuring the logo remains highly impactful and memorable.`,
            `Pairing the vibrant ${color.name} with ${font.name} yields an energetic visual identity. The font's structural integrity is instantly highlighted by this unique color choice, allowing the brand to stand out brilliantly across any medium.`,
            `This layout leverages the elegant nature of ${color.name} alongside the timeless structural flow of ${font.name}. The outcome is a perfectly balanced, approachable design that will deeply resonate with a broad audience.`
        ];
        // simple determinism
        const hash = (color.name.length + font.name.length) % templates.length;
        document.getElementById('ai-description').innerHTML = templates[hash];
    }

    // SVG Generator fallback
    function generateDemoLogoSVG(color, font) {
        const fontStyles = {
            'font1': 'font-family: "Poppins", sans-serif; font-weight: 700;',
            'font2': 'font-family: "Bebas Neue", sans-serif;',
            'font3': 'font-family: "Comic Sans MS", cursive;',
            'font4': 'font-family: monospace; letter-spacing: 2px;'
        };
        const style = fontStyles[font.id] || fontStyles['font1'];
        return `
        <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#050505" />
            <g transform="translate(400, 250)">
                <circle cx="0" cy="0" r="80" fill="none" stroke="${color.hex}" stroke-width="8" opacity="0.3"/>
                <path d="M-40,20 L0,-40 L40,20 Z" fill="${color.hex}" />
                <circle cx="0" cy="0" r="20" fill="#050505" />
            </g>
            <text x="400" y="410" font-size="54" fill="${color.hex}" text-anchor="middle" style="${style}">
                YOUR LOGO
            </text>
            <text x="400" y="450" font-size="20" fill="#a0a0b0" text-anchor="middle" style="font-family: 'Poppins', sans-serif; letter-spacing: 4px;">
                BRAND CONCEPT
            </text>
        </svg>`;
    }

    // 5. Submit Preview to WhatsApp
    document.getElementById('approve-btn').addEventListener('click', () => {
        const text = `Hello! I have reviewed the logo concepts for *${config.projectName}*.\n\n` + 
                     `I would like to proceed with:\n` +
                     `🎨 *Color:* ${selectedColor.name}\n` +
                     `🔤 *Font:* ${selectedFont.name}\n\n` +
                     `Please let me know the next steps.`;
        window.open(`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
    });

    // 6. AI Color Palette Generation (Color Palette Tab)
    const palettesGrid = document.getElementById('palettes-grid');
    let selectedPalette = null;

    function generatePalettes(query) {
        palettesGrid.innerHTML = '';
        
        // Mock palettes generator logic using seed hues
        const baseHues = query.length > 0 
            ? [Math.random() * 360, Math.random() * 360, Math.random() * 360, Math.random() * 360] 
            : [290, 220, 150, 45, 10, 320, 180, 90]; // 290 is Purple area
        
        const count = 8;
        for (let i = 0; i < count; i++) {
            const hue = baseHues[i % baseHues.length] + (Math.random() * 20 - 10);
            
            // Generate two harmonious colors
            const c1 = HSLToHex(hue, 75, 55);
            const c2 = HSLToHex((hue + 40) % 360, 65, 45);
            
            const pName = query ? `${query.charAt(0).toUpperCase() + query.slice(1)} Motif ${i+1}` : `Aesthetic Motif ${i+1}`;
            
            const card = document.createElement('div');
            card.className = 'palette-card';
            card.innerHTML = `
                <div class="palette-card-title">${pName}</div>
                <div class="colors-row">
                    <div class="color-item">
                        <div class="color-swatch-circle" style="background-color: ${c1}"></div>
                        <div class="color-info">
                            <span class="color-name">Primary</span>
                            <span class="color-code">${c1}</span>
                        </div>
                    </div>
                    <div class="color-item">
                        <div class="color-swatch-circle" style="background-color: ${c2}"></div>
                        <div class="color-info">
                            <span class="color-name">Secondary</span>
                            <span class="color-code">${c2}</span>
                        </div>
                    </div>
                </div>
            `;
            
            card.addEventListener('click', () => {
                document.querySelectorAll('.palette-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                selectedPalette = { name: pName, c1, c2 };
            });
            
            palettesGrid.appendChild(card);
        }
    }

    // Initial palette generation (empty query means default curated list)
    generatePalettes('');

    document.getElementById('ai-generate-btn').addEventListener('click', () => {
        const query = document.getElementById('ai-color-prompt').value.trim();
        const btn = document.getElementById('ai-generate-btn');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        setTimeout(() => {
            generatePalettes(query);
            btn.innerHTML = 'Generate';
        }, 800);
    });

    document.getElementById('ai-color-prompt').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('ai-generate-btn').click();
        }
    });

    // 7. Submit Selected Palette to WhatsApp
    document.getElementById('palette-submit-btn').addEventListener('click', () => {
        if (!selectedPalette) {
            alert('Please select a color palette first.');
            return;
        }
        const text = `Hello! I have generated and selected a new color palette for my brand.\n\n` + 
                     `*Palette Name:* ${selectedPalette.name}\n` +
                     `🎨 *Primary Color:* ${selectedPalette.c1}\n` +
                     `🎨 *Secondary Color:* ${selectedPalette.c2}\n\n` +
                     `Please let me know the next steps.`;
        window.open(`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
    });

    // Helper: HSL to HEX function
    function HSLToHex(h, s, l) {
        h = (h + 360) % 360; // Normalize
        s /= 100;
        l /= 100;
        let c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
            m = l - c/2,
            r = 0, g = 0, b = 0;
            
        if (0 <= h && h < 60) { r = c; g = x; b = 0; }
        else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
        else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
        else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
        else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
        else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
        
        r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
        g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
        b = Math.round((b + m) * 255).toString(16).padStart(2, '0');
        
        return "#" + r + g + b;
    }

    // Run preview update on start
    updatePreview();
});
