document.getElementById('contributionForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // --- Show a "Processing" message on the button ---
    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.textContent = 'Processing...';
    submitButton.disabled = true;

    // Get form values
    const name = document.getElementById('name').value;
    const mobile = document.getElementById('mobile').value;
    const unit = document.getElementById('unit').value;
    const amount = document.getElementById('amount').value;
    const paymentMode = document.getElementById('paymentMode').value;
    const receiptNumber = Date.now(); // Generate a unique receipt number

    // --- Prepare data for Google Sheet ---
    const formData = {
        receiptNumber: receiptNumber,
        name: name,
        mobile: mobile,
        unit: unit,
        amount: parseFloat(amount).toFixed(2),
        paymentMode: paymentMode
    };

    // --- Paste your Google Apps Script Web App URL here ---
    const googleSheetURL = 'https://script.google.com/macros/s/AKfycbyqu-CQ93cSRsin02Yh15o4M41WmFlM0A0pkhFxbmnaTC_htWIj9RwpafsZ9ZK5Vlm15w/exec';

    // --- Send data to Google Sheet ---
    fetch(googleSheetURL, {
        method: 'POST',
        mode: 'no-cors', // Important for sending data to Google Scripts from a browser
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        // --- Generate and display the receipt regardless of sheet save status ---
        generateReceipt(formData, receiptNumber);
    })
    .catch(error => {
        console.error('Error sending data to Google Sheet:', error);
        alert('There was an error saving the data. Please try again.');
        // Even if there's an error, you might still want to generate the receipt
        generateReceipt(formData, receiptNumber);
    })
    .finally(() => {
        // --- Reset the button ---
        submitButton.textContent = 'Generate Receipt';
        submitButton.disabled = false;
    });
});

function generateReceipt(formData, receiptNumber) {
    // Get current date
    const today = new Date();
    const date = today.toLocaleDateString('en-IN');

    // Populate receipt details
    document.getElementById('receiptDate').textContent = date;
    document.getElementById('receiptNumber').textContent = receiptNumber;
    document.getElementById('receiptName').textContent = formData.name;
    document.getElementById('receiptMobile').textContent = formData.mobile;
    document.getElementById('receiptUnit').textContent = formData.unit;
    document.getElementById('receiptAmount').textContent = formData.amount;
    document.getElementById('receiptPaymentMode').textContent = formData.paymentMode;

    // Show the modal
    document.getElementById('receiptModal').style.display = 'block';
}


// --- All the modal and print functionality remains the same ---

// Close the modal
document.querySelector('.close-button').addEventListener('click', function() {
    document.getElementById('receiptModal').style.display = 'none';
});

// Close the modal if the user clicks outside of it
window.addEventListener('click', function(event) {
    if (event.target == document.getElementById('receiptModal')) {
        document.getElementById('receiptModal').style.display = 'none';
    }
});

// Print the receipt
document.getElementById('printButton').addEventListener('click', function() {
    const receiptContent = document.getElementById('receipt').innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print Receipt</title>');
    // Optional: Add some basic styling for printing
    printWindow.document.write('<style>body{font-family: Arial, sans-serif;} h2{text-align:center;} hr{border-top: 1px solid #000;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(receiptContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
});