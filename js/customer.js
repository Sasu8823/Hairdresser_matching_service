// E:\Hairdresser_matching_service\frontend\js\customer.js
const apiUrl =
    import.meta.env.VITE_API_URL;

document.getElementById('requestForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`${apiUrl}/api/request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const suggestions = await response.json(); // assuming the backend returns an array
            document.getElementById('response').innerText = '投稿が完了しました！';
            this.reset();
            localStorage.setItem('suggestions', JSON.stringify(suggestions));
            window.location.href = "main.html";
            renderSuggestions(suggestions);
        } else {
            document.getElementById('response').innerText = '投稿に失敗しました。';
        }
    } catch (err) {
        console.error(err);
        document.getElementById('response').innerText = 'エラーが発生しました。';
    }
});

function renderSuggestions(users) {
    const container = document.getElementById('suggestionContainer');
    container.innerHTML = '<div class="user-grid"></div>';
    const grid = container.querySelector('.user-grid');

    users.forEach(user => {
        const card = document.createElement('div');
        card.className = 'user-card';
        card.innerHTML = `
        <img src="${user.avatar_url || 'default-avatar.png'}" class="user-avatar" alt="avatar" />
        <div class="user-label">${user.name}</div>
        <div class="user-rating">★ ${user.rating || '0.0'}</div>
      `;
        grid.appendChild(card);
    });
}