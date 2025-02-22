export async function uploadFile(file) {
    const formData = new FormData();
    formData.append("audio", file);
  
    try {
      const response = await fetch("https://your-backend-endpoint.com/upload", {
        method: "POST",
        body: formData,
      });
  
      return response.ok;
    } catch (error) {
      console.error("Error uploading file:", error);
      return false;
    }
  }
  
  // export async function getTranscript() {
  //   try {
  //     const response = await fetch("https://your-backend-endpoint.com/transcript");
  //     if (!response.ok) throw new Error("Failed to fetch transcript");
  //     const data = await response.json();
  //     return data.transcript;
  //   } catch (error) {
  //     console.error("Error fetching transcript:", error);
  //     return "";
  //   }
  // }

  export async function getTranscript() {
    return `Hello, this is an urgent message from your bank. We have detected suspicious activity on your account. Please verify your identity immediately, or your account will be suspended.
  
    Congratulations! You have won a grand lottery prize of ₹10,00,000. To claim your winnings, please share your bank details and a processing fee of ₹2,000.
  
    Government notice: Your PAN card has been linked to illegal transactions. Immediate action is required to avoid legal consequences. Call us now to clear your name.
  
    Security alert: Your credit card has been used for an unauthorized transaction. If this wasn’t you, please share your card number and OTP to cancel the transaction.
  
    Work-from-home opportunity! Earn ₹50,000 per month with no experience. Simply pay a ₹5,000 registration fee to start earning today.
  
    Urgent: Your electricity bill is overdue. Pay now to avoid disconnection. Click here to make an instant payment.
  
    Investment alert! Double your money in one week. Invest ₹10,000 today and get ₹20,000 guaranteed. Limited slots available.
  
    Your phone number has been randomly selected for a special reward. Claim your prize by verifying your Aadhaar number now.
  
    Customs notice: Your international package is on hold due to unpaid clearance fees. Pay ₹8,000 now to release your shipment.
  
    Your insurance policy has expired. Renew today to continue coverage. Click here to make a secure payment.
  
    Alert! Your social media account is at risk. Confirm your login credentials now to prevent unauthorized access.
  
    Limited-time offer: Get a free vacation package by paying a small registration fee. Book now before the offer expires.
  
    Attention: You have a pending refund from the tax department. Please share your bank details to process the refund.
  
    Immediate action required: Your bank account will be blocked due to unusual login attempts from a foreign country. Verify now to prevent deactivation.
  
    Fake job alert! We are hiring for a high-paying position. Send your resume along with a ₹3,000 processing fee to get started.
  
    Warning: Your mobile service will be suspended due to non-payment. Click the link below to make a payment now.
  
    Exclusive Bitcoin investment scheme: Earn massive returns in just 7 days. Invest ₹5,000 now for guaranteed profits.
  
    Your car loan approval is ready! Just pay a small fee of ₹4,999 to finalize the process.
  
    This is an official notification from the Reserve Bank. Your bank account needs re-verification. Kindly confirm your details immediately to avoid restrictions.
  
    Act fast! This offer is valid for the next 30 minutes only. Failure to act will result in your account being blocked.`;
  }
  
  


  export async function getSuspicionScore() {
    try {
      const response = await fetch("/api/suspicion-score"); // Replace with your actual endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch suspicion score");
      }
      const data = await response.json();
      return data.score; // Assuming the response contains { "score": 75 }
    } catch (error) {
      console.error("Error fetching suspicion score:", error);
      return 0; // Default to 0 if there's an error
    }
  }
  
  



  