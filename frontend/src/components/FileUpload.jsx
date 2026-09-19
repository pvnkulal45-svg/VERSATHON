import { useState } from "react";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    setError("");
    setFile(null);

    if (!selectedFile) {
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    // API connection will be added next.
    console.log("Selected PDF:", file.name);
  };

  return (
    <div className="upload-container">
      <h2>Learn From Your Notes</h2>
      <p>Upload your study material as a PDF.</p>

      <input
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileChange}
      />

      {file && (
        <p>
          Selected: <strong>{file.name}</strong>
        </p>
      )}

      {error && <p>{error}</p>}

      <button onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
}

export default FileUpload;
