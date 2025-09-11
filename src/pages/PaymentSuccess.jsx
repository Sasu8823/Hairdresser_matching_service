import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const matchingId = searchParams.get('matching_id');
  const [matching, setMatching] = useState(null);

  useEffect(() => {
    if (matchingId) {
      // マッチング情報を取得（必要に応じて）
      console.log('Payment successful for matching:', matchingId);
    }
  }, [matchingId]);

  return (
    <div className="payment-success-container">
      <div className="success-content">
        <div className="success-icon">✅</div>
        <h1>決済が完了しました！</h1>
        <p>マッチング成立手数料の支払いが正常に完了しました。</p>
        
        {matchingId && (
          <div className="matching-info">
            <p><strong>マッチングID:</strong> {matchingId}</p>
          </div>
        )}
        
        <div className="next-steps">
          <h3>次のステップ</h3>
          <ul>
            <li>マッチング一覧で確認してください</li>
            <li>施術者とチャットで詳細を相談できます</li>
            <li>施術完了後、レビューをお願いします</li>
          </ul>
        </div>
        
        <div className="action-buttons">
          <button 
            className="btn-primary"
            onClick={() => window.location.href = '/'}
          >
            ホームに戻る
          </button>
        </div>
      </div>
    </div>
  );
}
