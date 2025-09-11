// src/services/liffService.js
import liff from "@line/liff";

const LIFF_ID =
    import.meta.env.VITE_LIFF_ID;

export async function initLiff() {
    try {
        await liff.init({ liffId: LIFF_ID });

        if (liff.isLoggedIn()) {
            const profile = await liff.getProfile();
            console.log("User profile:", profile);

            // ユーザー情報をサーバーに保存
            await saveUserToServer(profile);

            return profile;
        } else {
            // ログインしていない場合はログイン画面にリダイレクト
            liff.login();
        }
    } catch (error) {
        console.error("LIFF initialization failed:", error);
        throw error;
    }
}

export async function saveUserToServer(profile) {
    try {
        const response = await fetch('/api/save-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                line_user_id: profile.userId,
                name: profile.displayName,
                avatar_url: profile.pictureUrl,
                status_message: profile.statusMessage
            })
        });

        if (!response.ok) {
            throw new Error('Failed to save user to server');
        }

        return await response.json();
    } catch (error) {
        console.error('Error saving user:', error);
        throw error;
    }
}

export async function getAccessToken() {
    try {
        if (liff.isLoggedIn()) {
            return liff.getAccessToken();
        }
        return null;
    } catch (error) {
        console.error('Error getting access token:', error);
        return null;
    }
}

export function isLoggedIn() {
    return liff.isLoggedIn();
}

export function logout() {
    if (liff.isLoggedIn()) {
        liff.logout();
    }
}

// 既存のコードとの互換性のため
const liffService = {
    login: async() => {
        try {
            await liff.init({ liffId: LIFF_ID });

            if (!liff.isLoggedIn()) {
                liff.login();
                return null; // Redirects to LINE login, won't continue this function
            }

            const profile = await liff.getProfile();
            await saveUserToServer(profile);
            return profile;
        } catch (error) {
            console.error("LIFF login failed:", error);
            throw error;
        }
    },
};

export default liffService;