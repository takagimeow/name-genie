---
name: 'add-tailwindcss-and-daisyui-to-basic-data-router'
root: '.'
output: '**/*'
ignore: []
---

# `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

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

# `package.json`

```json
{
  "name": "basic-data-router",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "serve": "vite preview"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-router-dom": "^6.10.0"
  },
  "devDependencies": {
    "@rollup/plugin-replace": "5.0.2",
    "@types/node": "18.11.18",
    "@types/react": "18.0.27",
    "@types/react-dom": "18.0.10",
    "@vitejs/plugin-react": "3.0.1",
    "daisyui": "^2.51.6",
    "msw": "^1.2.1",
    "postcss": "^8.4.23",
    "tailwindcss": "^3.3.2",
    "typescript": "4.9.5",
    "vite": "4.0.4"
  },
  "msw": {
    "workerDirectory": "public"
  }
}
```

# `postcss.config.js`

```js
module.exports = {
  plugins: [require('tailwindcss'), require('autoprefixer')],
};
```

# `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}
```