"use client"; // Pour Next.js 13+ (dossier /app)

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ArticleResponse {
  title: string;
  content: string;
  keyword: string;
}

export default function GeneratedArticlesSlider() {
  const [articles, setArticles] = useState<ArticleResponse[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pour la popup de preview
  const [showPreview, setShowPreview] = useState(false);

  const knownKeywords = [
    "chaussures de randonnée",
    "SEO local",
    "marketing automation",
  ];

  useEffect(() => {
    async function fetchAllArticles() {
      try {
        setLoading(true);
        setError(null);

        const promises = knownKeywords.map(async (keyword) => {
          const response = await fetch("http://localhost:8000/generateArticle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ main_keyword: keyword }),
          });

          if (!response.ok) {
            throw new Error(
              `Erreur lors de la génération de l'article pour le mot-clé: ${keyword}`
            );
          }

          const data = await response.json();
          return {
            title: data.title,
            content: data.content,
            keyword: keyword,
          };
        });

        const results = await Promise.all(promises);
        setArticles(results);
        setCurrentIndex(0);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Une erreur s'est produite.");
      } finally {
        setLoading(false);
      }
    }

    fetchAllArticles();
  }, []);

  // Navigation
  const goPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };
  const goNext = () => {
    if (currentIndex < articles.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Sécurise l'index
  const safeIndex = Math.min(Math.max(0, currentIndex), articles.length - 1);
  const currentArticle = articles[safeIndex];

  // Pour extraire juste une portion en texte brut
  function getShortSnippet(htmlString: string, maxLength = 200) {
    // Supprime les balises HTML
    const textOnly = htmlString.replace(/<\/?[^>]+(>|$)/g, "");
    // Tronque si trop long
    return textOnly.length > maxLength
      ? textOnly.slice(0, maxLength) + "..."
      : textOnly;
  }

  // Framer Motion
  const parentVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.2 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={parentVariants}
      initial="hidden"
      animate="visible"
      style={{ marginBottom: 32, position: "relative", padding: 24 }}
    >
      <motion.h2
        variants={itemVariants}
        style={{
          color: "#ff5200",
          marginBottom: 16,
          fontSize: "2rem",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        BrodAI’s Ready-to-Publish Articles
      </motion.h2>

      {loading && (
        <motion.p variants={itemVariants} style={{ textAlign: "center" }}>
          Génération en cours, veuillez patienter...
        </motion.p>
      )}

      {error && (
        <motion.p
          variants={itemVariants}
          style={{ color: "red", textAlign: "center" }}
        >
          {error}
        </motion.p>
      )}

      {articles.length > 0 && !loading && !error && (
        <motion.div
          variants={itemVariants}
          style={{
            background: "#fff",
            borderRadius: 8,
            padding: 24,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            maxWidth: 700,
            margin: "0 auto",
            position: "relative",
          }}
        >
          <p style={{ marginBottom: 16, color: "#333", fontSize: "1rem" }}>
            Each article is structured with the proper HTML tags, on-page SEO,
            and built-in <strong>rich media</strong> and <strong>backlink building</strong>
            so Google can’t resist ranking it!
          </p>

          {/* Flèche ← */}
          <button
            onClick={goPrevious}
            style={{
              position: "absolute",
              left: -45,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              fontSize: "2rem",
              cursor: currentIndex > 0 ? "pointer" : "default",
              color: currentIndex > 0 ? "#333" : "#aaa",
            }}
            disabled={currentIndex === 0}
          >
            ←
          </button>

          {/* Card de l’article courant */}
          <article
            style={{
              border: "1px solid #f0f0f0",
              borderRadius: 8,
              padding: 16,
              background: "#fafafa",
            }}
          >
            <header>
              <h3
                style={{
                  marginBottom: 8,
                  color: "#2563EB",
                  fontSize: "1.25rem",
                  lineHeight: 1.4,
                }}
              >
                {currentArticle.title}
              </h3>
            </header>

            {/* Affiche un extrait tronqué du contenu */}
            <section>
              <p style={{ fontSize: "1rem", lineHeight: 1.6 }}>
                {getShortSnippet(currentArticle.content, 200)}
              </p>
            </section>

            <footer style={{ marginTop: 16 }}>
              <p style={{ marginBottom: 4 }}>
                <strong>Keyword ciblé :</strong> {currentArticle.keyword}
              </p>
              <p style={{ color: "#059669", fontWeight: "bold" }}>
                High Probability to Rank on Page 1 within 2 Weeks!
              </p>
            </footer>

            {/* Boutons “Preview / Customize” */}
            <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
              <button
                style={{
                  padding: "8px 16px",
                  borderRadius: 4,
                  background: "#E5E7EB",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => setShowPreview(true)} // Ouvre la popup
              >
                Preview Article
              </button>
              <button
                style={{
                  padding: "8px 16px",
                  borderRadius: 4,
                  background: "#E5E7EB",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() =>
                  (window.location.href = `http://localhost:3000/create-article?keyword=${encodeURIComponent(
                    currentArticle.keyword
                  )}`)
                }
              >
                Customize Article
              </button>
            </div>
          </article>

          {/* Flèche → */}
          <button
            onClick={goNext}
            style={{
              position: "absolute",
              right: -45,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              fontSize: "2rem",
              cursor:
                currentIndex < articles.length - 1 ? "pointer" : "default",
              color: currentIndex < articles.length - 1 ? "#333" : "#aaa",
            }}
            disabled={currentIndex === articles.length - 1}
          >
            →
          </button>

          <p style={{ color: "#333", fontSize: "1rem", marginTop: 24 }}>
            Ready to publish and start attracting new visitors?
          </p>

          <p
            style={{
              marginTop: 16,
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
          >
            Or... Run BrodAI on Your Store
          </p>

          <div style={{ marginTop: 8 }}>
            <button
              style={{
                padding: "12px 16px",
                borderRadius: 4,
                background: "#2563EB",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                marginRight: 8,
              }}
            >
              Let BrodAI Handle Everything
            </button>
            <button
              style={{
                padding: "12px 16px",
                borderRadius: 4,
                background: "#fff",
                color: "#2563EB",
                border: "2px solid #2563EB",
                cursor: "pointer",
              }}
            >
              Customize with BrodAI
            </button>
          </div>
        </motion.div>
      )}

      {/* Popup de preview : affiche le contenu complet */}
      {showPreview && currentArticle && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              padding: 24,
              maxWidth: "80%",
              maxHeight: "80%",
              overflowY: "auto",
            }}
          >
            <h2 style={{ marginTop: 0, color: "#2563EB" }}>
              {currentArticle.title}
            </h2>
            <div
              dangerouslySetInnerHTML={{ __html: currentArticle.content }}
              style={{ lineHeight: 1.6 }}
            />
            <button
              onClick={() => setShowPreview(false)}
              style={{
                marginTop: 16,
                padding: "8px 16px",
                borderRadius: 4,
                background: "#E5E7EB",
                border: "none",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
