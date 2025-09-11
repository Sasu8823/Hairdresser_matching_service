// frontend/js/app.js
const apiUrl =
    import.meta.env.VITE_API_URL;
console.log('app.js is loaded!');

document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM is loaded!');

    try {
        await liff.init({ liffId: '2007683083-YlNv7qrZ' }); // your actual LIFF ID
        console.log('LIFF initialized');

        if (!liff.isLoggedIn()) {
            // Optional: prompt login
            // liff.login({ redirectUri: window.location.href }); // return here after login
        } else {
            await getUserProfile();
            console.log('LIFF isLoggedIn:', liff.isLoggedIn());
            console.log('LIFF access token:', liff.getAccessToken());
        }
    } catch (error) {
        console.error('LIFF init failed:', error);
    }

    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', async() => {
            try {
                // const profile = await liff.getProfile();
                // console.log('LINE Profile:', profile);

                const user = {
                    line_user_id: 'lineId' ,
                    name: 'user_name' ,
                    avatar_url: 'avatar_url' ,
                    status_message:  '',
                };
                console.log(user, 'user');
                
                // Save to localStorage (optional)
                localStorage.setItem('loggedInUser', JSON.stringify(user));

                // Update UI if needed
                const userProfile = document.getElementById('userProfile');
                if (userProfile) {
                    userProfile.innerHTML = `
                        <img src="${user.avatar_url}" alt="ユーザー画像" class="avatar">
                        <span class="username">${user.name}</span>
                    `;
                }

                // Send to backend
                const response = await fetch(`${apiUrl}/api/save-user`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(user)
                });

                if (!response.ok) {
                    throw new Error('Failed to save user');
                }

                console.log('User saved successfully');
                window.location.href = 'main.html';

            } catch (err) {
                console.error('Login flow failed:', err);
                alert('LINEログインまたはプロフィール保存に失敗しました');
            }
        });
    }

    // Optional: Payment button setup

    const paymentBtn = document.getElementById('paymentBtn');
    if (paymentBtn) {
        paymentBtn.addEventListener('click', () => {
            console.log('paybtn');
            if (window.apiService && typeof apiService.startPayment === 'function') {
                apiService.startPayment();
            } else {
                console.warn('apiService.startPayment is not available');
            }
        });
    }

});