import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Image from 'next/image'

type CardData = {
  id: number
  name: string
  type_line: string
  power?: number
  toughness?: number
  colors: string[]
  rarity: string
  released_at: string
  img: string
}

export default function CardPage() {
  const { query } = useRouter()
  const id = Array.isArray(query.id) ? query.id[0] : query.id

  const [card, setCard] = useState<CardData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [dupLoading, setDupLoading] = useState(false)
  const [dupError, setDupError] = useState<string | null>(null)
  const [newId, setNewId] = useState<number | null>(null)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    if (!id || !apiUrl) return

    setLoading(true)
    setError(null)
    setCard(null)

    fetch(`${apiUrl}/getcard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: Number(id) }),
    })
      .then(async res => {
        if (!res.ok) throw new Error(await res.text() || res.statusText)
        const data = (await res.json()) as CardData[]
        return data[0]
      })
      .then(c => setCard(c))
      .catch(err => {
        console.error(err)
        setError('Failed to load card.')
      })
      .finally(() => setLoading(false))
  }, [id, apiUrl])

  const handleDuplicate = async () => {
    if (!apiUrl || !id) return

    setDupLoading(true)
    setDupError(null)
    setNewId(null)

    try {
      const res = await fetch(`${apiUrl}/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: Number(id) }),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || res.statusText)
      }
      const data = (await res.json()) as { new_id: number }
      setNewId(data.new_id)
    } catch (err: any) {
      console.error(err)
      setDupError(err.message)
    } finally {
      setDupLoading(false)
    }
  }

  if (loading) return <p className="p-4">Loading card…</p>
  if (error)   return <p className="p-4 text-red-600">{error}</p>
  if (!card)  return null

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-4">{card.name}</h1>

        <div className="flex justify-center mb-6">
          <Image
            src={card.img}
            width={500}
            height={500}
            alt={card.name}
          />
        </div>

        {/* Duplicate Button */}
        <div className="flex flex-col items-center mt-6">
          <button
            onClick={handleDuplicate}
            disabled={dupLoading}
            className={`font-bold py-2 px-6 rounded text-white ${
              dupLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-700'
            }`}
          >
            {dupLoading ? 'Duplicating…' : 'Duplicate'}
          </button>
          {newId !== null && (
            <p className="mt-2 text-green-600">
              Duplicated! New card ID: {newId}
            </p>
          )}
          {dupError && (
            <p className="mt-2 text-red-600">
              {dupError}
            </p>
          )}
        </div>

        <h2 className="text-lg font-medium mb-2 mt-8">Details</h2>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-black-500">
            <thead className="text-xs text-black-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-sm">Type</th>
                <th className="px-6 py-3 text-sm">Power/Toughness</th>
                <th className="px-6 py-3 text-sm">Colors</th>
                <th className="px-6 py-3 text-sm">Rarity</th>
                <th className="px-6 py-3 text-sm">Released At</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b even:bg-gray-50">
                <td className="px-6 py-4 text-sm">{card.type_line}</td>
                <td className="px-6 py-4 text-sm">
                  {card.power ?? '—'}/{card.toughness ?? '—'}
                </td>
                <td className="px-6 py-4 text-sm">{card.colors.join(', ')}</td>
                <td className="px-6 py-4 text-sm">{card.rarity}</td>
                <td className="px-6 py-4 text-sm">{card.released_at}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
