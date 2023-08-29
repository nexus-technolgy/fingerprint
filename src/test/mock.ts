import { logger } from "@nexustech/logger";
import { readFile } from "fs";
import { createServer } from "http";
import mime from "mime";

const files = {
  "/fingerprint.min.js": "./dist/fingerprint.min.js",
  default: "./src/test/example.html",
};

logger.info("Server listening on http://localhost:3000/");
createServer((req, res) => {
  logger.info(req.method, req.url);
  const target = req.url?.split("?")[0] ?? "/";
  const file = files[target] ?? files["default"];
  try {
    readFile(file, (err, data) => {
      if (err) {
        logger.error(err);
        res.writeHead(500);
        res.end();
      } else {
        const fileType = file?.split(".").pop() ?? "html";
        const mimeType = mime.getType(fileType);
        res.writeHead(200, { "Content-Type": mimeType ?? "text/html" });
        res.end(data);
      }
    });
  } catch {
    res.writeHead(404);
    res.end();
  }
}).listen(3000);
