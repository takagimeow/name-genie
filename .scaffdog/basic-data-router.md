---
name: 'basic-data-router'
root: '.'
output: '**/*'
ignore: []
---

# `src/hooks/example.test.ts`

```tsx
import React from "react";
import { renderHook, act } from "@testing-library/react-hooks"

const useCount = () => {
  const [count, setCount] = React.useState(0)
  return {
    count,
    setCount
  }
}
it("smoke test", () => {
  const { result } = renderHook(() => useCount())
  act(() => {
    result.current.setCount(1)
  })
  expect(result.current.count).toBe(1)
})

```

# `src/app.tsx`

```tsx
import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useLoaderData,
} from "react-router-dom";

import "./index.css";

let router = createBrowserRouter([
  {
    path: "/",
    loader: () => ({ message: "Hello Data Router!" }),
    Component() {
      let data = useLoaderData() as { message: string };
      return <h1>{data.message}</h1>;
    },
  },
]);

export default function App() {
  return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}
```

# `src/index.css`

```tsx
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
}
```

# `src/main.tsx`

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";

const setup = async () => {
  if (process.env.NODE_ENV === 'development') {
    const { worker } = await import('./mocks/browser')
    worker.start()
  }
}

setup().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
})
```

# `src/vite-env.d.ts`

```tsx
/// <reference types="vite/client" />

```

# `test/setup-test-env.ts`

```tsx
import "@testing-library/jest-dom/extend-expect";
import type React from "react";
import { vi } from "vitest";

```

# `.gitignore`

```
node_modules
.DS_Store
dist
dist-ssr
*.local

```

# `index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Router - Basic Data Router Example</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

```

# `package.json`

```json
{
  "name": "basic-data-router",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "serve": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-router-dom": "^6.10.0"
  },
  "devDependencies": {
    "@rollup/plugin-replace": "5.0.2",
    "@testing-library/dom": "^9.2.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^14.0.0",
    "@testing-library/react-hooks": "^8.0.1",
    "@testing-library/user-event": "^14.4.3",
    "@types/node": "18.11.18",
    "@types/react": "18.0.27",
    "@types/react-dom": "18.0.10",
    "@vitejs/plugin-react": "3.0.1",
    "@vitest/coverage-c8": "^0.31.0",
    "happy-dom": "^9.10.9",
    "msw": "^1.2.1",
    "typescript": "4.9.5",
    "vite": "4.0.4",
    "vite-tsconfig-paths": "^4.2.0",
    "vitest": "^0.31.0"
  },
  "msw": {
    "workerDirectory": "public"
  }
}

```

# `README.md`

```markdown
---
title: Basic (Data Router)
toc: false
order: 1
---

# Data Routers

This example demonstrates a simple usage of a Data Router, using `createBrowserRouter` and `<RouterProvider>`.

## Preview

# Basic Data Router

```

# `tsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "target": "ESNext",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "types": ["vitest/globals"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react",
    "importsNotUsedAsValues": "error"
  },
  "include": ["./src"]
}

```

# `vite.config.ts`

```ts
import * as path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import rollupReplace from "@rollup/plugin-replace";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173
  },
  plugins: [
    rollupReplace({
      preventAssignment: true,
      values: {
        __DEV__: JSON.stringify(true),
        "process.env.NODE_ENV": JSON.stringify("development"),
      },
    }),
    react(),
  ],
  resolve: process.env.USE_SOURCE
    ? {
        alias: {
          "@remix-run/router": path.resolve(
            __dirname,
            "../../packages/router/index.ts"
          ),
          "react-router": path.resolve(
            __dirname,
            "../../packages/react-router/index.ts"
          ),
          "react-router-dom": path.resolve(
            __dirname,
            "../../packages/react-router-dom/index.tsx"
          ),
        },
      }
    : {},
});

```

# `vitest.config.ts`

```ts
/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./test/setup-test-env.ts"],
    include: ["./src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    watchExclude: [
      ".*\\/node_modules\\/.*",
      ".*\\/build\\/.*",
      ".*\\/postgres-data\\/.*",
    ],
  },
});
```

<!-- MSW -->
# `src/mocks/handlers.ts`

```js
import { rest } from 'msw';

export const handlers = [
  rest.get('/articles', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: [
          {
            id: "1",
            title: "Article 1",
            content: "Content 1"
          },
          {
            id: "2",
            title: "Article 2",
            content: "Content 2"
          },
          {
            id: "3",
            title: "Article 3",
            content: "Content 3"
          },
        ]
      })
    )
  })
]
```

# `src/mocks/browser.ts`

```ts
import { setupWorker } from 'msw'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
```

# `public/mockServiceWorker.js`

```javascript
/* eslint-disable */
/* tslint:disable */

/**
 * Mock Service Worker (1.2.1).
 * @see https://github.com/mswjs/msw
 * - Please do NOT modify this file.
 * - Please do NOT serve this file on production.
 */

const INTEGRITY_CHECKSUM = '3d6b9f06410d179a7f7404d4bf4c3c70'
const activeClientIds = new Set()

self.addEventListener('install', function () {
  self.skipWaiting()
})

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('message', async function (event) {
  const clientId = event.source.id

  if (!clientId || !self.clients) {
    return
  }

  const client = await self.clients.get(clientId)

  if (!client) {
    return
  }

  const allClients = await self.clients.matchAll({
    type: 'window',
  })

  switch (event.data) {
    case 'KEEPALIVE_REQUEST': {
      sendToClient(client, {
        type: 'KEEPALIVE_RESPONSE',
      })
      break
    }

    case 'INTEGRITY_CHECK_REQUEST': {
      sendToClient(client, {
        type: 'INTEGRITY_CHECK_RESPONSE',
        payload: INTEGRITY_CHECKSUM,
      })
      break
    }

    case 'MOCK_ACTIVATE': {
      activeClientIds.add(clientId)

      sendToClient(client, {
        type: 'MOCKING_ENABLED',
        payload: true,
      })
      break
    }

    case 'MOCK_DEACTIVATE': {
      activeClientIds.delete(clientId)
      break
    }

    case 'CLIENT_CLOSED': {
      activeClientIds.delete(clientId)

      const remainingClients = allClients.filter((client) => {
        return client.id !== clientId
      })

      // Unregister itself when there are no more clients
      if (remainingClients.length === 0) {
        self.registration.unregister()
      }

      break
    }
  }
})

self.addEventListener('fetch', function (event) {
  const { request } = event
  const accept = request.headers.get('accept') || ''

  // Bypass server-sent events.
  if (accept.includes('text/event-stream')) {
    return
  }

  // Bypass navigation requests.
  if (request.mode === 'navigate') {
    return
  }

  // Opening the DevTools triggers the "only-if-cached" request
  // that cannot be handled by the worker. Bypass such requests.
  if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') {
    return
  }

  // Bypass all requests when there are no active clients.
  // Prevents the self-unregistered worked from handling requests
  // after it's been deleted (still remains active until the next reload).
  if (activeClientIds.size === 0) {
    return
  }

  // Generate unique request ID.
  const requestId = Math.random().toString(16).slice(2)

  event.respondWith(
    handleRequest(event, requestId).catch((error) => {
      if (error.name === 'NetworkError') {
        console.warn(
          '[MSW] Successfully emulated a network error for the "%s %s" request.',
          request.method,
          request.url,
        )
        return
      }

      // At this point, any exception indicates an issue with the original request/response.
      console.error(
        `\
[MSW] Caught an exception from the "%s %s" request (%s). This is probably not a problem with Mock Service Worker. There is likely an additional logging output above.`,
        request.method,
        request.url,
        `${error.name}: ${error.message}`,
      )
    }),
  )
})

async function handleRequest(event, requestId) {
  const client = await resolveMainClient(event)
  const response = await getResponse(event, client, requestId)

  // Send back the response clone for the "response:*" life-cycle events.
  // Ensure MSW is active and ready to handle the message, otherwise
  // this message will pend indefinitely.
  if (client && activeClientIds.has(client.id)) {
    ;(async function () {
      const clonedResponse = response.clone()
      sendToClient(client, {
        type: 'RESPONSE',
        payload: {
          requestId,
          type: clonedResponse.type,
          ok: clonedResponse.ok,
          status: clonedResponse.status,
          statusText: clonedResponse.statusText,
          body:
            clonedResponse.body === null ? null : await clonedResponse.text(),
          headers: Object.fromEntries(clonedResponse.headers.entries()),
          redirected: clonedResponse.redirected,
        },
      })
    })()
  }

  return response
}

// Resolve the main client for the given event.
// Client that issues a request doesn't necessarily equal the client
// that registered the worker. It's with the latter the worker should
// communicate with during the response resolving phase.
async function resolveMainClient(event) {
  const client = await self.clients.get(event.clientId)

  if (client?.frameType === 'top-level') {
    return client
  }

  const allClients = await self.clients.matchAll({
    type: 'window',
  })

  return allClients
    .filter((client) => {
      // Get only those clients that are currently visible.
      return client.visibilityState === 'visible'
    })
    .find((client) => {
      // Find the client ID that's recorded in the
      // set of clients that have registered the worker.
      return activeClientIds.has(client.id)
    })
}

async function getResponse(event, client, requestId) {
  const { request } = event
  const clonedRequest = request.clone()

  function passthrough() {
    // Clone the request because it might've been already used
    // (i.e. its body has been read and sent to the client).
    const headers = Object.fromEntries(clonedRequest.headers.entries())

    // Remove MSW-specific request headers so the bypassed requests
    // comply with the server's CORS preflight check.
    // Operate with the headers as an object because request "Headers"
    // are immutable.
    delete headers['x-msw-bypass']

    return fetch(clonedRequest, { headers })
  }

  // Bypass mocking when the client is not active.
  if (!client) {
    return passthrough()
  }

  // Bypass initial page load requests (i.e. static assets).
  // The absence of the immediate/parent client in the map of the active clients
  // means that MSW hasn't dispatched the "MOCK_ACTIVATE" event yet
  // and is not ready to handle requests.
  if (!activeClientIds.has(client.id)) {
    return passthrough()
  }

  // Bypass requests with the explicit bypass header.
  // Such requests can be issued by "ctx.fetch()".
  if (request.headers.get('x-msw-bypass') === 'true') {
    return passthrough()
  }

  // Notify the client that a request has been intercepted.
  const clientMessage = await sendToClient(client, {
    type: 'REQUEST',
    payload: {
      id: requestId,
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      cache: request.cache,
      mode: request.mode,
      credentials: request.credentials,
      destination: request.destination,
      integrity: request.integrity,
      redirect: request.redirect,
      referrer: request.referrer,
      referrerPolicy: request.referrerPolicy,
      body: await request.text(),
      bodyUsed: request.bodyUsed,
      keepalive: request.keepalive,
    },
  })

  switch (clientMessage.type) {
    case 'MOCK_RESPONSE': {
      return respondWithMock(clientMessage.data)
    }

    case 'MOCK_NOT_FOUND': {
      return passthrough()
    }

    case 'NETWORK_ERROR': {
      const { name, message } = clientMessage.data
      const networkError = new Error(message)
      networkError.name = name

      // Rejecting a "respondWith" promise emulates a network error.
      throw networkError
    }
  }

  return passthrough()
}

function sendToClient(client, message) {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel()

    channel.port1.onmessage = (event) => {
      if (event.data && event.data.error) {
        return reject(event.data.error)
      }

      resolve(event.data)
    }

    client.postMessage(message, [channel.port2])
  })
}

function sleep(timeMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeMs)
  })
}

async function respondWithMock(response) {
  await sleep(response.delay)
  return new Response(response.body, response)
}
```
