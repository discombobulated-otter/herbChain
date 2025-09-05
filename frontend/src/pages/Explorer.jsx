import { useState } from "react";

export default function Explorer() {
  const [formType, setFormType] = useState("collection");
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: Replace with actual API calls later
    console.log("Submitting:", formType, formData);

    setMessage(`✅ ${formType} event submitted successfully!`);
    
    // Reset the form after submission
    setFormData({}); 
    // Clear all input fields by resetting the specific keys for the current formType
    const fieldsToReset = e.target.elements;
    for (let i = 0; i < fieldsToReset.length; i++) {
        if(fieldsToReset[i].name) {
            setFormData(prev => ({...prev, [fieldsToReset[i].name]: ''}));
        }
    }
  };

  return (
    <div>
      <h1>Supply Chain Explorer</h1>

      <label>
        Select Event Type:
        <select value={formType} onChange={(e) => {
            setFormType(e.target.value);
            setFormData({}); // Clear form data when switching types
            setMessage(""); // Clear message on type switch
        }}>
          <option value="collection">Collection Event</option>
          <option value="processing">Processing Step</option>
          <option value="quality">Quality Test</option>
        </select>
      </label>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        {formType === "collection" && (
          <>
            <input
              type="text"
              name="id"
              placeholder="Collection ID"
              value={formData.id || ""}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lat"
              placeholder="Latitude"
              value={formData.lat || ""}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lng"
              placeholder="Longitude"
              value={formData.lng || ""}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="species"
              placeholder="Species"
              value={formData.species || ""}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="collectorId"
              placeholder="Collector ID"
              value={formData.collectorId || ""}
              onChange={handleChange}
              required
            />
          </>
        )}

        {formType === "processing" && (
          <>
            <input
              type="text"
              name="batchId"
              placeholder="Batch ID"
              value={formData.batchId || ""}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="step"
              placeholder="Processing Step"
              value={formData.step || ""}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="processorId"
              placeholder="Processor ID"
              value={formData.processorId || ""}
              onChange={handleChange}
              required
            />
          </>
        )}

        {formType === "quality" && (
          <>
            <input
              type="text"
              name="batchId"
              placeholder="Batch ID"
              value={formData.batchId || ""}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="testType"
              placeholder="Test Type"
              value={formData.testType || ""}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="result"
              placeholder="Result"
              value={formData.result || ""}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="labId"
              placeholder="Lab ID"
              value={formData.labId || ""}
              onChange={handleChange}
              required
            />
          </>
        )}

        <button type="submit">Submit Event</button>
      </form>

      {message && <p style={{ marginTop: "15px" }}>{message}</p>}
    </div>
  );
}