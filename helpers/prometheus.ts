import { NextFunction, Request, Response } from "express";
import client from "prom-client";

const register = new client.Registry();

client.collectDefaultMetrics({
  prefix: "intel_",
  register,
  labels: {
    app: "intel",
  },
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
});

const httpRequestTimer = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 10],
});

register.registerMetric(httpRequestTimer);

export const httpRequestTimerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const end = httpRequestTimer.startTimer();
  const route = req.originalUrl;

  res.on("finish", () => {
    end({ route, status: res.statusCode, method: req.method });
  });

  next();
};

export { register };
