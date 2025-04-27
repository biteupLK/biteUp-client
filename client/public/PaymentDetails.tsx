import React, { useEffect, useState } from "react";

const PaymentDetails: React.FC = () => {
  const [htmlContent, setHtmlContent] = useState<string>("");

  useEffect(() => {
    // Fetch the HTML content from the public directory
    fetch("/paymentDetails.html")
      .then((response) => response.text())
      .then((html) => setHtmlContent(html));
  }, []);

  return (
    <div>
      <div
        dangerouslySetInnerHTML={{
          __html: htmlContent,
        }}
      />
    </div>
  );
};

export default PaymentDetails;
