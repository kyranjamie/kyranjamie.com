import { defineConfig, fontProviders } from 'astro/config'

export default defineConfig({
  publicDir: './static',
  site: 'https://kyranjamie.com',
  vite: {
    plugins: [
      {
        name: 'pgp-plain-text',
        configureServer(server) {
          // Cloudflare's static/_headers rules do not apply in Astro dev.
          server.middlewares.use((req, res, next) => {
            if (req.url?.split('?')[0] === '/pgp.asc') {
              res.setHeader('Content-Type', 'text/plain; charset=utf-8')
              res.setHeader('Content-Disposition', 'inline')
            }
            next()
          })
        },
      },
    ],
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Commit Mono',
      cssVariable: '--font-commit-mono',
      options: {
        display: 'swap',
        variants: [
          {
            src: ['./src/assets/fonts/CommitMono-VF.woff2'],
            weight: '200 700',
            style: 'normal',
          },
        ],
      },
    },
  ],
})
