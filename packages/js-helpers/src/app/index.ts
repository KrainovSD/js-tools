/* eslint-disable no-console */
import { createFetchClient } from "../api/api";

const controller = new AbortController();

const client = createFetchClient({
  client: window.fetch.bind(window),
  afterHandlers: [],
  beforeHandlers: [],
  oauthOptions: undefined,
  retries: [1],
});

const apiRequest = client.requestWithArrayResponse;

async function test() {
  const [data, error] = await apiRequest<string>({
    method: "GET",
    path: "https://httpbin.org/delay/5",
    signal: controller.signal,
    timeout: 2000,
    onError: (type, error) => {
      console.log(error.description, type);
    },
  });
  console.log(data, error);
}

const button = document.createElement("button");
button.style.height = "30px";
button.style.width = "100px";
button.style.display = "flex";
button.textContent = "Отменить";

document.body.appendChild(button);
button.addEventListener(
  "click",
  () => {
    controller.abort();
  },
  { signal: controller.signal },
);

void test();
