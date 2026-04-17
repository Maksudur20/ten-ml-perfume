import { products } from '@/data/products'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const query = url.searchParams.get('q')?.toLowerCase() || ''

  if (!query || query.length < 2) {
    return Response.json({ results: [] })
  }

  const results = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.notes.some((note) => note.toLowerCase().includes(query))
  )

  return Response.json({
    results: results.slice(0, 10),
    total: results.length,
  })
}
