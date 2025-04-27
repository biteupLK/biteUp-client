import React from "react";

const PaymentDetails: React.FC = () => {
  return (
    <div>
      <iframe
        src="/paymentDetails.html"
        width="100%"
        height="500px"
        style={{ border: "none" }}
        title="Payment Details"
      ></iframe>
    </div>
  );
};

export default PaymentDetails;
