import React from "react";
import Header from "../../components/client/Header.jsx";
import { CheckoutPage as CheckoutPageComponent } from "../../components/client/cart/CheckoutPage.jsx";

export default function CheckoutPage() {
  return (
    <div className="wrapper">
      <Header />
      <main className="main-content" style={{ paddingTop: 0 }}>
        <CheckoutPageComponent />
      </main>
    </div>
  );
}

