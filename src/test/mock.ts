import { logger } from "@nexustech/logger";
import { readFile } from "fs";
import { createServer } from "http";
import mime from "mime";

logger.info("Server listening on http://localhost:3000/");
createServer((req, res) => {
  logger.info(req.method, req.url);
  try {
    readFile("./src/test" + (req.url == "/" ? "/example.html" : req.url ?? "/example.html").split("?")[0], (err, data) => {
      if (err) {
        logger.error(err);
        res.writeHead(500);
        res.end(err);
      } else {
        const fileType = req.url?.split(".").pop() ?? "html";
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
