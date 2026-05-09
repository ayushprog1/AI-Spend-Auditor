@import "tailwindcss";

@theme {
  --color-primary: #22C55E;
  --color-secondary: #102A29;
  --radius-4xl: 2rem;
}

/* Keep the rest of your custom CSS below this */
@layer base {
  body {
    @apply antialiased text-slate-900 bg-white;
  }
}