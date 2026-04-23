import express from "express";
const app = express();

// 添加日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 添加根路由处理
app.get("/", (req, res) => {
  res.json({ message: "Hello from Express on Cloud Functions!" });
});

// Cron heartbeat job - runs every 5 minutes
app.all("/cron/heartbeat", (req, res) => {
  res.json({
    status: "alive",
    timestamp: new Date().toISOString(),
    job: "heartbeat",
  });
});

// Cron daily cleanup job - runs at 2 AM daily
app.post("/cron/cleanup", express.json(), (req, res) => {
  const { type = "daily", dryRun = false } = req.body || {};
  res.json({
    status: "completed",
    timestamp: new Date().toISOString(),
    job: "daily-cleanup",
    type,
    dryRun,
  });
});

// 导出处理函数
export default app;
