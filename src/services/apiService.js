// src/services/apiService.js
export async function startPayment() {
  try {
    const response = await fetch("http://localhost:3000/create-payment-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 1500, // Amount in yen
        currency: "jpy",
        description: "美容師マッチングサービス",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create payment session");
    }

    const session = await response.json();

    // Redirect to Stripe Checkout
    window.location.href = session.url;
  } catch (error) {
    console.error("Payment error:", error);
    alert("支払いの処理中にエラーが発生しました。");
  }
}