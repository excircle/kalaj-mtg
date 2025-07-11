import { useState, useEffect } from 'react'
import Url from '../components/url'
import Image from 'next/image'

type CardData = {
  name: string
  type_line: string
  power?: string     // Scryfall returns these as strings
  toughness?: string
  colors: string[]
  rarity: string
  released_at: string
  image_uris: {
    normal: string
    [key: string]: any
  }
  [key: string]: any
}

export default function Register() {
  const [url, setUrl] = useState<string>('')
  const [card, setCard] = useState<CardData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // new:
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    if (!url) return

    setLoading(true)
    setError(null)
    setSuccess(null)
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

  const handleRegister = async () => {
    if (!card || !apiUrl) return

    setSubmitting(true)
    setError(null)
    setSuccess(null)

    // build exactly the payload your API expects
    const payload = {
      name: card.name,
      type_line: card.type_line,
      power: card.power ? Number(card.power) : undefined,
      toughness: card.toughness ? Number(card.toughness) : undefined,
      colors: card.colors,
      rarity: card.rarity,
      released_at: card.released_at,
      img: card.image_uris.normal,
    }

    try {
      const res = await fetch(`${apiUrl}/card`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || res.statusText)
      }

      const msg = await res.text()
      setSuccess(msg)
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold">Register Card</h1>
        <hr className="h-px my-8 bg-gray-200 border-0" />
      </div>

      {/* URL Input */}
      <div className="max-w-2xl mx-auto mb-8">
        <Url onUrlSubmit={setUrl} />
      </div>

      {/* Loading / Error */}
      <div className="max-w-2xl mx-auto mb-8">
        {loading && <p className="text-blue-600">Loading card data…</p>}
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
      </div>

      {/* Card Details */}
      {card && (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">{card.name}</h2>

          <div className="flex justify-center mb-6">
            <Image
              src={card.image_uris.normal}
              width={300}
              height={300}
              alt={card.name}
            />
          </div>

          <h3 className="mt-6 text-lg font-medium">Raw JSON</h3>
          <pre className="mt-2 p-4 bg-gray-50 rounded overflow-auto text-sm">
            {JSON.stringify(
              {
                name: card.name,
                type_line: card.type_line,
                power: card.power,
                toughness: card.toughness,
                colors: card.colors,
                rarity: card.rarity,
                released_at: card.released_at,
                img: card.image_uris.normal,
              },
              null,
              2
            )}
          </pre>

          {/* Register Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleRegister}
              disabled={submitting}
              className={`font-bold py-2 px-6 rounded ${
                submitting
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-blue-500 hover:bg-blue-700 text-white'
              }`}
            >
              {submitting ? 'Registering…' : 'Register'}
            </button>
             {/* Reset */}
             <button
               onClick={() => {
                 setCard(null)
                 setUrl('')
                 setError(null)
                 setSuccess(null)
               }}
               disabled={submitting}
               className="font-bold py-2 px-6 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
             >
               Reset
             </button>
          </div>
        </div>
      )}
    </div>
  )
}
