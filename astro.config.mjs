import { defineConfig, fontProviders } from 'astro/config'

export default defineConfig({
  publicDir: './static',
  site: 'https://kyranjamie.com',
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
