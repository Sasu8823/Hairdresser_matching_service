// src/components/MainPage.jsx
import React, { useState } from "react";
import yenIcon from "../assets/img/yen.png"; // Adjust path to your project

export default function MainPage() {
  const [showQrModal, setShowQrModal] = useState(false);

  return (
    <>
      <header></header>

      <div className="header">
        <span className="header-title">SALOMO</span>
        <div className="user-profile" id="userProfile"></div>
      </div>

      <div className="main-container">
        <div className="salomo-box">SALOMO</div>

        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "16px 0 0 0",
            marginBottom: "16px",
          }}
        >
          <div className="tab-bar">
            <span>&#9986;</span>
            <span>&#10084;</span>
            <span>
              <img src={yenIcon} alt="yen" className="yen-icon" />
            </span>
          </div>

          <div className="button-row">
            <button className="btn-red">「施術希望」を投稿</button>
            <button className="btn-green">サロンの空席を確認してみる</button>
          </div>
        </div>

        <div id="requestList" className="request-list"></div>

        <div className="profile-section">
          {/* Status */}
          <div className="profile-card">
            <div className="profile-title">ステータス・特徴</div>
            <div className="profile-divider"></div>
            <div className="profile-content"></div>
          </div>

          {/* Reviews */}
          <div className="profile-card">
            <div className="profile-title">お客様からのレビュー(1件)</div>
            <div className="profile-divider"></div>
            <div className="profile-content"></div>
          </div>

          {/* Introduction */}
          <div className="profile-card">
            <div className="profile-title">美容プロからのステキナ紹介文 (0件)</div>
            <div className="profile-divider"></div>
            <div className="profile-content">
              <div className="intro-box">
                <div className="intro-avatar">無評価</div>
                <div className="intro-text">
                  ※美容プロからの紹介文が投稿されるとこちらにステキナ紹介文が表示されます
                </div>
              </div>
              <button className="intro-btn">紹介文を投稿する方法</button>
            </div>
          </div>

          {/* Menu */}
          <div className="profile-card menu-card">
            <div className="profile-title">メニュー料金</div>
            <div className="profile-divider"></div>
            <div className="menu-list">
              {[
                "前髪カット",
                "カット＋カラー",
                "カット＋カラー＋パーマ",
                "カット＋アイロンストレート",
                "3stepスムーストリートメント",
              ].map((item, index) => (
                <div className="menu-row" key={index}>
                  <span>{item}</span>
                  <span>1,500円</span>
                </div>
              ))}
            </div>
            <div className="menu-link">
              <a href="#">メニュー詳細 &gt;</a>
            </div>
          </div>

          {/* Awards */}
          <div className="profile-card award-card">
            <div className="profile-title">受賞・選出履歴</div>
            <div className="profile-divider"></div>
            <div className="award-content">ステキなサロンランキング</div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div id="qrModal" className="modal">
          <div className="modal-content">
            <span
              className="close-btn"
              onClick={() => setShowQrModal(false)}
            >
              &times;
            </span>
            <p>LINEで友だち追加してメッセージを送ってください:</p>
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?data=https://line.me/R/ti/p/@zhs3670o&size=200x200"
              alt="LINE QR Code"
              className="qr-image"
            />
          </div>
        </div>
      )}
    </>
  );
}
