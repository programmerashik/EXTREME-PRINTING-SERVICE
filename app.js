// File upload interaction
const fileUpload = document.getElementById('fileUpload');
const actualFile = document.getElementById('actualFile');

fileUpload.addEventListener('click', () => {
    actualFile.click();
});

actualFile.addEventListener('change', () => {
    if (actualFile.files.length > 0) {
        fileUpload.innerHTML = `
            <i class="fas fa-check-circle" style="color: #4ECDC4;"></i>
            <p>${actualFile.files[0].name}</p>
            <small style="color: #666;">Click to change file</small>
        `;
    }
});

// Drag and drop functionality
fileUpload.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUpload.style.borderColor = '#4ECDC4';
    fileUpload.style.backgroundColor = 'rgba(78, 205, 196, 0.1)';
});

fileUpload.addEventListener('dragleave', () => {
    fileUpload.style.borderColor = '#ddd';
    fileUpload.style.backgroundColor = 'transparent';
});

fileUpload.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUpload.style.borderColor = '#ddd';
    fileUpload.style.backgroundColor = 'transparent';

    if (e.dataTransfer.files.length > 0) {
        actualFile.files = e.dataTransfer.files;
        fileUpload.innerHTML = `
            <i class="fas fa-check-circle" style="color: #4ECDC4;"></i>
            <p>${e.dataTransfer.files[0].name}</p>
            <small style="color: #666;">Click to change file</small>
        `;
    }
});

// FAQ accordion
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const icon = question.querySelector('i');

        answer.classList.toggle('active');
        icon.classList.toggle('fa-chevron-down');
        icon.classList.toggle('fa-chevron-up');
    });
});

// Price calculation function
function calculatePrice() {
    const printType = document.getElementById('printType').value;
    const copies = parseInt(document.getElementById('copies').value) || 1;
    const binding = document.getElementById('binding').value;
    const deliveryZone = document.getElementById('deliveryZone').value;
    const deliverySpeed = document.getElementById('deliverySpeed').value;

    // Calculate printing cost
    let printPricePerPage = 0.10; // default BW
    if (printType === 'color') printPricePerPage = 0.25;
    if (printType === 'photo') printPricePerPage = 0.50;

    // For simplicity, assuming 1 page - in real app get page count from file
    const printingCost = printPricePerPage * copies;

    // Calculate binding cost
    let bindingCost = 0;
    if (binding === 'staple') bindingCost = 0.50;
    if (binding === 'spiral') bindingCost = 2.00;

    // Calculate delivery cost
    let deliveryCost = 1.50; // Nicosia city
    if (deliveryZone === 'nearby') deliveryCost = 2.50;
    if (deliverySpeed === 'express') deliveryCost += 3.00;

    // Update display
    document.getElementById('printingCost').textContent = `€${printingCost.toFixed(2)}`;
    document.getElementById('bindingCost').textContent = `€${bindingCost.toFixed(2)}`;
    document.getElementById('deliveryCost').textContent = `€${deliveryCost.toFixed(2)}`;

    const totalCost = printingCost + bindingCost + deliveryCost;
    document.getElementById('totalCost').textContent = `€${totalCost.toFixed(2)}`;
}

// Add event listeners for all form elements
const priceElements = ['paperSize', 'printType', 'copies', 'binding', 'deliveryZone', 'deliverySpeed']
    .map(id => document.getElementById(id));

priceElements.forEach(element => {
    element.addEventListener('change', calculatePrice);
});

// Recalculate when copies input changes
document.getElementById('copies').addEventListener('input', calculatePrice);

// Calculate initial price
calculatePrice();

// WhatsApp Integration - Form Submission
document.getElementById('printingForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Collect all order details
    const orderDetails = {
        paperSize: document.getElementById('paperSize').options[document.getElementById('paperSize').selectedIndex].text,
        printType: document.getElementById('printType').options[document.getElementById('printType').selectedIndex].text,
        copies: document.getElementById('copies').value,
        binding: document.getElementById('binding').options[document.getElementById('binding').selectedIndex].text,
        deliveryZone: document.getElementById('deliveryZone').options[document.getElementById('deliveryZone').selectedIndex].text,
        deliverySpeed: document.getElementById('deliverySpeed').options[document.getElementById('deliverySpeed').selectedIndex].text,
        paymentMethod: document.querySelector('input[name="payment"]:checked').nextSibling.textContent.trim(),
        totalCost: document.getElementById('totalCost').textContent
    };

    // Format WhatsApp message
    let message = `*New Print Order - Extreme Printing*\n\n`;
    message += `📄 *Paper Size:* ${orderDetails.paperSize}\n`;
    message += `🎨 *Print Type:* ${orderDetails.printType}\n`;
    message += `🔢 *Copies:* ${orderDetails.copies}\n`;
    message += `📎 *Binding:* ${orderDetails.binding}\n`;
    message += `📍 *Delivery Zone:* ${orderDetails.deliveryZone}\n`;
    message += `⚡ *Delivery Speed:* ${orderDetails.deliverySpeed}\n`;
    message += `💳 *Payment Method:* ${orderDetails.paymentMethod}\n`;
    message += `💰 *Total Cost:* ${orderDetails.totalCost}\n\n`;
    message += `📤 *Please follow these steps:*\n`;
    message += `1. Send your file in this chat\n`;
    message += `2. Confirm with your phone number\n`;
    message += `3. Complete payment after we confirm\n\n`;
    message += `Thank you! 🚀`;

    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);

    // Replace with your Cyprus WhatsApp business number (without + sign)
    const whatsappNumber = "8801861677258";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');

    // Show confirmation message to user
    alert('Order details sent to WhatsApp. Please send your file via WhatsApp to complete the order.');

    // Reset form after submission (optional)
    setTimeout(() => {
        document.getElementById('printingForm').reset();
        fileUpload.innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <p>Drag & drop your file here, or <span style="color: #FF6B6B;">select file</span></p>
        `;
        calculatePrice(); // Reset price
    }, 3000);
});