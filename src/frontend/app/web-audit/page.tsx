"use client";
import React, { useState } from "react";
import { Input, Button, Spin, message, Modal, Tag } from "antd";

type Recommendation = {
  priority: string;
  issue: string;
  recommendation: string;
};

export default function WebAuditPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [originalContent, setOriginalContent] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "blue";
    }
  };

  const handleAudit = async () => {
    if (!url) {
      message.warning("Please enter a URL");
      return;
    }
    setLoading(true);
    try {
      // Appel au backend
      const resp = await fetch("http://localhost:8000/webAudit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!resp.ok) {
        throw new Error(`Server error: ${resp.status}`);
      }
      const data = await resp.json();
      // data.recommendations => tableau d'objets
      setRecommendations(data.recommendations || []);
      setOriginalContent(data.original_content || "");
      setModalOpen(true);
    } catch (err: any) {
      console.error(err);
      message.error("Could not perform web audit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: 600 }}>
      <h2>Web Audit Page</h2>
      <p>Enter the URL of the website you want to audit:</p>
      <Input
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ marginBottom: "1rem" }}
      />
      <Button type="primary" onClick={handleAudit} disabled={loading}>
        {loading ? <Spin /> : "Scrape & Audit"}
      </Button>

      {/* Modal d'affichage du rapport */}
      <Modal
        title="Technical Audit Report"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setModalOpen(false)}>
            Close
          </Button>
        ]}
      >
        {recommendations.length === 0 ? (
          <p>No recommendations found (or parse error).</p>
        ) : (
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {recommendations.map((rec, idx) => (
              <li key={idx} style={{ marginBottom: "1rem" }}>
                <div>
                  <Tag color={getPriorityColor(rec.priority)} style={{ fontWeight: "bold" }}>
                    {rec.priority}
                  </Tag>
                  <span style={{ marginLeft: 6 }}>{rec.issue}</span>
                </div>
                <div style={{ marginLeft: 32, marginTop: 4 }}>
                  <em>Suggestion:</em> {rec.recommendation}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
}
