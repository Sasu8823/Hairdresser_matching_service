import liff from "@line/liff";

export async function initLiff() {
    try {
        await liff.init({ liffId: "YOUR_LIFF_ID" });
        console.log("LIFF initialized");
    } catch (error) {
        console.error("LIFF init error", error);
    }
}
