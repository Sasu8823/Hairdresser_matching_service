// E: \Hairdresser_matching_service\ frontend\ js\ liffService.js
const liffService = {
    login: function() {
        liff.init({ liffId: '2007683839-YM9j8eej' }).then(() => {
            if (!liff.isLoggedIn()) {
                liff.login();
            } else {
                const profile = liff.getDecodedIDToken();
                alert(`Logged in as ${profile.name}`);
            }
        }).catch(console.error);
    }
};