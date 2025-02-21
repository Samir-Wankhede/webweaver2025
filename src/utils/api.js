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
  
  export async function getTranscript() {
    try {
      const response = await fetch("https://your-backend-endpoint.com/transcript");
      if (!response.ok) throw new Error("Failed to fetch transcript");
      const data = await response.json();
      return data.transcript;
    } catch (error) {
      console.error("Error fetching transcript:", error);
      return "";
    }
  }
  