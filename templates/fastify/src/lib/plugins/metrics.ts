import client from "prom-client";

export function registerMetrics() {
  client.collectDefaultMetrics();

  return { client };
}
