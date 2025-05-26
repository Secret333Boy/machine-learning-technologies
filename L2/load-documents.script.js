import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const start = async () => {
  const documentsPath = path.join(__dirname, "./harry-potter-docs");

  const docsPaths = fs.globSync(`${documentsPath}/**/*.txt`);

  for (const docPath of docsPaths) {
    try {
      const buffer = fs.readFileSync(docPath);
      const formData = new FormData();
      formData.append("file", new Blob([buffer], { type: "text/plain" }));

      console.log(`Loading ${docPath}...`);

      const res = await fetch("http://localhost:3000/vectorizer/add_document", {
        method: "POST",
        body: formData,
      });

      console.log(res);

      if (!res.ok) {
        throw new Error(await res.text());
      }

      console.log(`Finished!\n---`);
    } catch (e) {
      console.error(`Failed to load document ${docPath}: ${e.message}`);
    }
  }
};

start();
