export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://ideahunt.app'
  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
      images: [`${base}/og.png`],
    },
  ]
}
