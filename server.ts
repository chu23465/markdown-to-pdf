// Port is 3001
// Purely AI generated and fixed
// Google Search AI

import path from "path";
import vfsData from "./vfs-data.ts";

Bun.serve({
  port: 3001,
  fetch(req) {
    const url = new URL(req.url);
    let filepath = url.pathname === "/" ? "/index.html" : url.pathname;
    const base64Content = vfsData[filepath.replace("/", "")];
    if (base64Content) {
      const ext = path.extname(filepath);
      const mimeTypes: Record<string, string> = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "text/javascript",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".svg": "image/svg+xml"
      };
      
      // Convert base64 string back to binary buffer data for the Response
      const fileBuffer = Buffer.from(base64Content, "base64");
      
      return new Response(fileBuffer, {
        headers: { "Content-Type": mimeTypes[ext] || "application/octet-stream" }
      });
    }
    
    return new Response("Not Found", { status: 404 });
  }
});
