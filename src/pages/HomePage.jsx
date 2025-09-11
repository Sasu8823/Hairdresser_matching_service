import React, { useState } from "react";
import CustomerRequestForm from "./CustomerRequestForm.jsx";
import RequestList from "./RequestList.jsx";
import MatchingList from "./MatchingList.jsx";

export default function HomePage({ user }) {
  const [activeTab, setActiveTab] = useState("requests");

  return (
    <div className="homepage-container">
      <div className="welcome-section">
        <h1>SALOMO</h1>
        <p className="subtitle">美容師マッチングサービス</p>
        {user && (
          <p className="welcome-message">
            こんにちは、{user.displayName}さん！
          </p>
        )}
      </div>

      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === "requests" ? "active" : ""}`}
          onClick={() => setActiveTab("requests")}
        >
          施術希望一覧
        </button>
        <button 
          className={`tab-btn ${activeTab === "post" ? "active" : ""}`}
          onClick={() => setActiveTab("post")}
        >
          希望を投稿
        </button>
        <button 
          className={`tab-btn ${activeTab === "matchings" ? "active" : ""}`}
          onClick={() => setActiveTab("matchings")}
        >
          マッチング一覧
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "requests" && <RequestList user={user} />}
        {activeTab === "post" && <CustomerRequestForm user={user} />}
        {activeTab === "matchings" && <MatchingList user={user} />}
      </div>
    </div>
  );
}
