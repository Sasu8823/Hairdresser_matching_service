import React, { useState, useEffect } from "react";

export default function AdminDashboard() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [matchings, setMatchings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/dashboard`);
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/requests`);
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  };

  const fetchMatchings = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/matchings`);
      if (response.ok) {
        const data = await response.json();
        setMatchings(data);
      }
    } catch (error) {
      console.error('Failed to fetch matchings:', error);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/payments`);
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // タブに応じてデータを取得
    switch (tab) {
      case 'users':
        fetchUsers();
        break;
      case 'requests':
        fetchRequests();
        break;
      case 'matchings':
        fetchMatchings();
        break;
      case 'payments':
        fetchPayments();
        break;
      default:
        break;
    }
  };

  if (loading) {
    return <div className="admin-loading">読み込み中...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>SALOMO 管理画面</h1>
        <div className="admin-nav">
          <button 
            className={`nav-btn ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => handleTabChange("dashboard")}
          >
            ダッシュボード
          </button>
          <button 
            className={`nav-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => handleTabChange("users")}
          >
            ユーザー管理
          </button>
          <button 
            className={`nav-btn ${activeTab === "requests" ? "active" : ""}`}
            onClick={() => handleTabChange("requests")}
          >
            リクエスト管理
          </button>
          <button 
            className={`nav-btn ${activeTab === "matchings" ? "active" : ""}`}
            onClick={() => handleTabChange("matchings")}
          >
            マッチング管理
          </button>
          <button 
            className={`nav-btn ${activeTab === "payments" ? "active" : ""}`}
            onClick={() => handleTabChange("payments")}
          >
            売上管理
          </button>
        </div>
      </div>

      <div className="admin-content">
        {activeTab === "dashboard" && dashboardData && (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>総ユーザー数</h3>
                <p className="stat-number">{dashboardData.users}</p>
              </div>
              <div className="stat-card">
                <h3>総リクエスト数</h3>
                <p className="stat-number">{dashboardData.requests}</p>
              </div>
              <div className="stat-card">
                <h3>総マッチング数</h3>
                <p className="stat-number">{dashboardData.matchings}</p>
              </div>
              <div className="stat-card">
                <h3>総売上</h3>
                <p className="stat-number">¥{dashboardData.revenue.total_revenue?.toLocaleString() || 0}</p>
              </div>
            </div>

            <div className="revenue-stats">
              <h3>決済状況</h3>
              <div className="revenue-grid">
                <div className="revenue-item">
                  <span>決済完了:</span>
                  <span>{dashboardData.revenue.paid_count}件</span>
                </div>
                <div className="revenue-item">
                  <span>未決済:</span>
                  <span>{dashboardData.revenue.unpaid_count}件</span>
                </div>
              </div>
            </div>

            <div className="rank-stats">
              <h3>ランク別統計</h3>
              <div className="rank-grid">
                {dashboardData.rankStats.map((rank) => (
                  <div key={rank.rank_code} className="rank-item">
                    <span className="rank-name">{rank.rank_name}</span>
                    <span className="rank-count">{rank.count}件</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="users-content">
            <h2>ユーザー一覧</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>名前</th>
                    <th>タイプ</th>
                    <th>エリア</th>
                    <th>評価</th>
                    <th>リクエスト数</th>
                    <th>オファー数</th>
                    <th>マッチング数</th>
                    <th>登録日</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>
                        <div className="user-info">
                          <img src={user.avatar_url || "/default-avatar.png"} alt={user.name} className="user-avatar" />
                          {user.name}
                        </div>
                      </td>
                      <td>{user.user_type}</td>
                      <td>{user.area || "-"}</td>
                      <td>★ {user.rating || "0.0"}</td>
                      <td>{user.request_count}</td>
                      <td>{user.offer_count}</td>
                      <td>{user.matching_count}</td>
                      <td>{new Date(user.created_at).toLocaleDateString('ja-JP')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "requests" && (
          <div className="requests-content">
            <h2>リクエスト一覧</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>顧客</th>
                    <th>メニュー</th>
                    <th>日時</th>
                    <th>予算</th>
                    <th>ランク</th>
                    <th>エリア</th>
                    <th>オファー数</th>
                    <th>ステータス</th>
                    <th>投稿日</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.id}</td>
                      <td>
                        <div className="user-info">
                          <img src={request.customer_avatar || "/default-avatar.png"} alt={request.customer_name} className="user-avatar" />
                          {request.customer_name}
                        </div>
                      </td>
                      <td>{request.menu}</td>
                      <td>{request.date} {request.time}</td>
                      <td>¥{request.price.toLocaleString()}</td>
                      <td>
                        <span className={`rank-badge rank-${request.rank_code.toLowerCase()}`}>
                          {request.rank_code}ランク
                        </span>
                      </td>
                      <td>{request.area}</td>
                      <td>{request.offer_count}</td>
                      <td>
                        <span className={`status-badge status-${request.status}`}>
                          {request.status}
                        </span>
                      </td>
                      <td>{new Date(request.created_at).toLocaleDateString('ja-JP')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "matchings" && (
          <div className="matchings-content">
            <h2>マッチング一覧</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>顧客</th>
                    <th>施術者</th>
                    <th>メニュー</th>
                    <th>日時</th>
                    <th>リクエスト価格</th>
                    <th>オファー価格</th>
                    <th>手数料</th>
                    <th>決済状況</th>
                    <th>ステータス</th>
                    <th>マッチング日</th>
                  </tr>
                </thead>
                <tbody>
                  {matchings.map((matching) => (
                    <tr key={matching.id}>
                      <td>{matching.id}</td>
                      <td>
                        <div className="user-info">
                          <img src={matching.customer_avatar || "/default-avatar.png"} alt={matching.customer_name} className="user-avatar" />
                          {matching.customer_name}
                        </div>
                      </td>
                      <td>
                        <div className="user-info">
                          <img src={matching.stylist_avatar || "/default-avatar.png"} alt={matching.stylist_name} className="user-avatar" />
                          {matching.stylist_name}
                        </div>
                      </td>
                      <td>{matching.menu}</td>
                      <td>{matching.date} {matching.time}</td>
                      <td>¥{matching.price.toLocaleString()}</td>
                      <td>¥{matching.offer_price.toLocaleString()}</td>
                      <td>¥{matching.commission_amount.toLocaleString()}</td>
                      <td>
                        <span className={`payment-status ${matching.commission_paid ? 'paid' : 'unpaid'}`}>
                          {matching.commission_paid ? '✅ 完了' : '❌ 未決済'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge status-${matching.status}`}>
                          {matching.status}
                        </span>
                      </td>
                      <td>{new Date(matching.matched_at).toLocaleDateString('ja-JP')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="payments-content">
            <h2>決済履歴</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>マッチングID</th>
                    <th>顧客</th>
                    <th>施術者</th>
                    <th>メニュー</th>
                    <th>金額</th>
                    <th>ステータス</th>
                    <th>決済方法</th>
                    <th>決済日</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.id}</td>
                      <td>{payment.matching_id}</td>
                      <td>{payment.customer_name}</td>
                      <td>{payment.stylist_name}</td>
                      <td>{payment.menu}</td>
                      <td>¥{payment.amount.toLocaleString()}</td>
                      <td>
                        <span className={`payment-status ${payment.status}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td>{payment.payment_method}</td>
                      <td>{new Date(payment.created_at).toLocaleDateString('ja-JP')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
