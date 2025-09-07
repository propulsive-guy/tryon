
window.addEventListener("DOMContentLoaded", () => {
    const savedPerson = localStorage.getItem("personImage");
    if (savedPerson) {
      const imgPreview = document.getElementById("savedPersonPreview");
      imgPreview.src = savedPerson;
      imgPreview.style.display = "block";
      document.getElementById("person").required = false; // no need to upload again
    }
  });
  
  document.getElementById("person").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        localStorage.setItem("personImage", reader.result); // save base64
        document.getElementById("savedPersonPreview").src = reader.result;
        document.getElementById("savedPersonPreview").style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });
  
  document.getElementById("tryonForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const savedPerson = localStorage.getItem("personImage");
    const cloth = document.getElementById("cloth").files[0];
  
    if (!savedPerson || !cloth) {
      alert("Please upload both images (at least person once, and cloth every time).");
      return;
    }
  
    const formData = new FormData();
  
    const res = await fetch(savedPerson);
    const blob = await res.blob();
    formData.append("person", blob, "person.png");
  
 
    formData.append("cloth", cloth);
  
    try {
      const response = await fetch("http://localhost:5000/tryon", {
        method: "POST",
        body: formData
      });
  
      if (!response.ok) throw new Error("Failed to generate image");
  
      const resultBlob = await response.blob();
      const url = URL.createObjectURL(resultBlob);
      document.getElementById("outputImage").src = url;
    } catch (err) {
      console.error("Error:", err);
      alert("Image generation failed: " + err.message);
    }
  });
  