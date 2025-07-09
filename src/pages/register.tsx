import { useState, useEffect } from 'react'
import Url from '../components/url'
import Image from 'next/image'

type CardData = {
  name: string
  type_line: string
  power?: string
  toughness?: string
  colors: string[]
  rarity: string
  released_at: string
  [key: string]: any
}

export default function Register() {
  const [url, setUrl] = useState<string>('')
  const [card, setCard] = useState<CardData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!url) return

    setLoading(true)
    setError(null)
    setCard(null)

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data: CardData) => {
        setCard(data)
      })
      .catch(err => {
        console.error(err)
        setError('Failed to fetch card data.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [url])

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold">Register Card</h1>
      </div>

      {/* URL Input */}
      <div className="max-w-2xl mx-auto mb-8">
        <Url onUrlSubmit={setUrl} />
      </div>

      {/* Loading / Error */}
      <div className="max-w-2xl mx-auto mb-8">
        {loading && <p className="text-blue-600">Loading card data…</p>}
        {error && <p className="text-red-600">{error}</p>}
      </div>

      {/* Card Details */}
      {card && (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">{card.name}</h2>
          <dl className="grid grid-cols-1 gap-y-4">
          <Image 
            src={card.image_uris.normal}
            width={300}
            height={300}
          />
          </dl>

          <h3 className="mt-6 text-lg font-medium">Raw JSON</h3>
          <pre className="mt-2 p-4 bg-gray-50 rounded overflow-auto text-sm">
            {JSON.stringify({
              name: card.name,
              type: card.type_line,
              power: card.power,
              toughness: card.toughness,
              colors: card.colors,
              rarity: card.rarity,
              released_at: card.released_at,
            }, null, 2)}
          </pre>
          <div className="flex justify-center mt-6">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Register
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
