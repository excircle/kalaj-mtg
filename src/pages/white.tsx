import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function White() {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchWhite() {
      try {
        const res = await fetch('http://kalaj-mtg:8000/cardcolors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ color: 'W' }),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setCards(data)
      } catch (err) {
        console.error(err)
        setError('Failed to load white cards')
      } finally {
        setLoading(false)
      }
    }
    fetchWhite()
  }, [])

  if (loading) return <p className="p-4">Loading white cards…</p>
  if (error)   return <p className="p-4 text-red-600">{error}</p>
  if (cards.length === 0) return <p className="p-4">No white cards found.</p>

  return (
    <div className="px-2 py-2">
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left text-black-500 dark:text-black-400">
          <thead className="text-xs text-black-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Power/Toughness</th>
              <th className="px-6 py-3">Colors</th>
              <th className="px-6 py-3">Rarity</th>
              <th className="px-6 py-3">Released At</th>
            </tr>
          </thead>
          <tbody>
            {cards.map(card => (
              <tr key={card.id} className="bg-white border-b even:bg-gray-50">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-blue-900 whitespace-nowrap"
                >
                  <Link href={`/card/${card.id}`}>
                    {card.name}
                  </Link>
                </th>
                <td className="px-6 py-4">{card.type_line}</td>
                <td className="px-6 py-4">
                  {card.power}/{card.toughness}
                </td>
                <td className="px-6 py-4">{card.colors.join(', ')}</td>
                <td className="px-6 py-4">{card.rarity}</td>
                <td className="px-6 py-4">{card.released_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
