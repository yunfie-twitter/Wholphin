import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Mock Search API
  app.get("/api/search", (req, res) => {
    const { q, page = "1", type = "web" } = req.query;
    const pageNum = parseInt(page as string);
    const query = q?.toString() || "";

    if (type === "suggest") {
      const suggestions = [
        query,
        `${query} apple`,
        `${query} design`,
        `${query} tutorial`,
        `${query} news`,
        `${query} framework`,
      ].filter(s => s.length > 0).slice(0, 5);
      
      return res.json({ results: suggestions.map(s => ({ title: s })) });
    }
    
    // Generate mock results
    const results = Array.from({ length: 10 }).map((_, i) => ({
      title: `${query} - ${type.toString().toUpperCase()} Insight ${i + 1 + (pageNum - 1) * 10}`,
      link: `https://example.com/result-${i}`,
      snippet: `Discover deep insights about "${query}" with Wholphin's advanced ${type} search. Experience the intersection of technology and liberal arts.`,
      source: i % 2 === 0 ? "Apple News" : "TechCrunch",
      date: "2h ago",
      thumbnail: type === 'image' ? `https://picsum.photos/seed/${query}${i}/800/600` : undefined
    }));

    res.json({
      results,
      totalResults: 1340,
      currentPage: pageNum,
      totalPages: 10,
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
