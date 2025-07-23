// E:\Hairdresser_matching_service\frontend\js\main.js
console.log('main.js loaded');
const messageBtn = document.querySelector('.btn-red');
if (messageBtn) {
    messageBtn.addEventListener('click', () => {
        console.log('Message button clicked');
        
        window.location.href = '/customer';
    });
}

const apiUrl = import.meta.env.VITE_API_URL; // or set manually if needed

async function fetchRequests() {
    try {
        const response = await fetch(`${apiUrl}/api/requests`);
        const requests = await response.json();
        renderRequests(requests); // create this function below
    } catch (error) {
        console.error('Error loading requests:', error);
    }
}

function renderRequests(requests) {
    const container = document.getElementById('requestList'); // you can change this
    container.innerHTML = '';

    requests.forEach(req => {
        const div = document.createElement('div');
        div.className = 'request-item';
        div.innerHTML = `
            <p><strong>メニュー:</strong> ${req.menu}</p>
            <p><strong>日付:</strong> ${req.date}</p>
            <p><strong>時間:</strong> ${req.time}</p>
            <p><strong>価格:</strong> ${req.price}円</p>
            <p><strong>希望条件:</strong> ${req.condition}</p>
            <p><strong>備考:</strong> ${req.note}</p>
            <hr>
        `;
        container.appendChild(div);
    });
}

// Call it on page load
document.addEventListener('DOMContentLoaded', fetchRequests);