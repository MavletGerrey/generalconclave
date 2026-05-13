"use client";

import { useState } from "react";

interface Props {
  productId: number;
  title: string;
  price: number;
}

export default function BuyButton({ productId, title, price }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleBuy() {
    setLoading(true);
    try {
      const orderId = `${productId}-${Date.now()}`;
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: price,
          orderId,
          description: title,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Ошибка оплаты. Попробуйте позже.");
        setLoading(false);
      }
    } catch {
      alert("Ошибка соединения. Попробуйте позже.");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="btn-apple"
      style={{
        width: "100%",
        textAlign: "center",
        border: "none",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? "Переход к оплате..." : `Купить — ${price} ₽`}
    </button>
  );
}
