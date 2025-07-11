// pages/index.tsx
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  // State to hold counts for W, B, G, U, R
  const [counts, setCounts] = useState<Record<string, number>>({
    W: 0,
    B: 0,
    G: 0,
    U: 0,
    R: 0,
  })
  const [error, setError] = useState<string | null>(null)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    if (!apiUrl) {
      setError('API not configured')
      return
    }
    fetch(`${apiUrl}/cards`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data: Record<string, number>) => {
        setCounts(prev => ({ ...prev, ...data }))
      })
      .catch(err => {
        console.error(err)
        setError('Failed to load card counts')
      })
  }, [apiUrl])

  return (
    <>
      {/* Text Card */}
      <div className="flex items-center justify-center py-10 px-10 bg-slate-200">
        <p>Behold my beautiful collection.</p>
      </div>

      {/* Stats Card */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          
          {error && (
            <p className="text-red-600 text-center mb-4">{error}</p>
          )}

          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center sm:grid-cols-2 lg:grid-cols-3">
            
            {/* White (W) */}
            <div className="border-2 border-black p-6 max-w-xs h-64 flex flex-col items-center justify-center gap-y-4">
              <dt className="text-3xl text-gray-600">{counts.W}</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                <Link href="/white">White Cards</Link>
              </dd>
            </div>

            {/* Black (B) */}
            <div className="border-2 border-black p-6 max-w-xs h-64 flex flex-col items-center justify-center gap-y-4">
              <dt className="text-3xl text-gray-600">{counts.B}</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                <Link href="/black">Black Cards</Link>
              </dd>
            </div>

            {/* Green (G) */}
            <div className="border-2 border-black p-6 max-w-xs h-64 flex flex-col items-center justify-center gap-y-4">
              <dt className="text-3xl text-gray-600">{counts.G}</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                <Link href="/green">Green Cards</Link>
              </dd>
            </div>

            {/* Bottom row: Blue (U) & Red (R) */}
            <div className="lg:col-span-3 flex justify-center gap-x-16">
              {/* Blue (U) */}
              <div className="border-2 border-black p-6 max-w-xs h-64 flex flex-col items-center justify-center gap-y-4">
                <dt className="text-3xl text-gray-600">{counts.U}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                  <Link href="/blue">Blue Cards</Link>
                </dd>
              </div>
              {/* Red (R) */}
              <div className="border-2 border-black p-6 max-w-xs h-64 flex flex-col items-center justify-center gap-y-4">
                <dt className="text-3xl text-gray-600">{counts.R}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                  <Link href="/red">Red Cards</Link>
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </div>
    </>
  )
}
