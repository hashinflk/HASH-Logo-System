const config = {
    // Client Details
    clientName: "Acme Corporation",
    projectName: "Brand Identity Design",
    
    // Contact Information (Where the selection should be sent)
    whatsappNumber: "94724229837", // Include country code, without '+'
    
    // Watermark Settings
    watermarkText: "#HASH iNfinite Lk", // Text watermark if image is not available
    
    // Options for the customer
    colors: [
        { id: 'color1', name: 'Yellow', hex: '#fff9c6ff' },
        { id: 'color2', name: 'Brand Accent', hex: '#c726dc' },
        { id: 'color3', name: 'Ocean Blue', hex: '#0052cc' },
        { id: 'color4', name: 'Forest Green', hex: '#00875a' }
    ],
    
    fonts: [
        { id: 'font1', name: 'Modern Sans' },
        { id: 'font2', name: 'Elegant Serif' },
        { id: 'font3', name: 'Playful Display' },
        { id: 'font4', name: 'Tech Mono' }
    ],
    
    // How your images are named. 
    // Example: if colors are 1-4 and fonts are 1-4, naming could be 'logo-color1-font1.png'
    // For this demo, we will use a function to generate a placeholder if image is missing.
    imageExtension: ".png",
    imageFolder: "assets/logos/"
};
