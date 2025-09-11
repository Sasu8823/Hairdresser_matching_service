import React from "react";
import liffService from "../services/liffService.js";

export default function LoginPage() {
  const handleLogin = async () => {
    try {
      await liffService.login();
    } catch (error) {
      console.error("Login failed:", error);
      alert("ログインに失敗しました。もう一度お試しください。");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo-section">
          <h1>SALOMO</h1>
          <p className="subtitle">美容師マッチングサービス</p>
        </div>
        
        <div className="login-content">
          <h2>LINEでログイン</h2>
          <p className="description">
            美容師・ネイリスト・アイリストと<br />
            簡単にマッチングできます
          </p>
          
          <button 
            className="line-login-btn"
            onClick={handleLogin}
          >
            <div className="line-icon">📱</div>
            LINEでログイン
          </button>
          
          <div className="features">
            <div className="feature-item">
              <span className="feature-icon">✂️</span>
              <span>美容師・ネイリスト・アイリスト</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💰</span>
              <span>予算に応じたランク制</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💬</span>
              <span>マッチング後のチャット機能</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
