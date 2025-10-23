import React, { useState } from "react";
import axios from "axios";

export default function ComplaintForm({ onCreated }) {
  const [form, setForm] = useState({
    category: "General",
    description: "",
    priority: "Medium",
    anonymous: false,
  });
  const [file, setFile] = useState(null);

  async function submit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token") || "";
    const fd = new FormData();
    fd.append("category", form.category);
    fd.append("description", form.description);
    fd.append("priority", form.priority);
    fd.append("anonymous", form.anonymous);
    if (file) fd.append("file", file);
    try {
      await axios.post("http://localhost:5000/api/complaints", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Complaint Submitted Successfully ✅");
      if (onCreated) {
  await onCreated();  // ✅ Ensure this runs after submission
}
      setForm({
        category: "General",
        description: "",
        priority: "Medium",
        anonymous: false,
      });
      setFile(null);
      if (onCreated) onCreated(); // refresh the list & timeline
    } catch (e) {
      alert(e.response?.data?.msg || e.message);
    }
  }

  return (
    <form
      onSubmit={submit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        background: "#fcfcfcff",
        padding: 20,
        borderRadius: 10,
      }}
    >
      <select
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      >
        <option>General</option>
        <option>Infrastructure</option>
        <option>Service</option>
      </select>

      <textarea
        placeholder="Describe your issue"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        required
        style={{ minHeight: 80 }}
      />

      <select
        value={form.priority}
        onChange={(e) => setForm({ ...form, priority: e.target.value })}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <label>
        <input
          type="checkbox"
          checked={form.anonymous}
          onChange={(e) => setForm({ ...form, anonymous: e.target.checked })}
        />{" "}
        Submit as Anonymous
      </label>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit" className="primary-btn">
        Submit Complaint
      </button>
    </form>
  );
}
