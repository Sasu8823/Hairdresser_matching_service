import React from "react";
import { useSearchParams } from "react-router-dom";

export default function PaymentCancel() {
  const [searchParams] = useSearchParams();
  const matchingId = searchParams.get('matching_id');

  return (
    <div className="payment-cancel-container">
      <div className="cancel-content">
        <div className="cancel-icon">❌</div>
        <h1>決済がキャンセルされました</h1>
        <p>決済がキャンセルされました。マッチングは成立していますが、手数料の支払いが完了していません。</p>
        
        {matchingId && (
          <div className="matching-info">
            <p><strong>マッチングID:</strong> {matchingId}</p>
          </div>
        )}
        
        <div className="next-steps">
          <h3>次のステップ</h3>
          <ul>
            <li>マッチング一覧から再度決済を行ってください</li>
            <li>決済完了後、チャット機能が利用可能になります</li>
            <li>お困りの場合はサポートまでお問い合わせください</li>
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
