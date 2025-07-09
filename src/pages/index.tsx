import Link from 'next/link'

export default function Home() {
    return (
      <>
        {/* Text Card */}
        <div className="flex items-center justify-center py-10 px-10 bg-slate-200">
          <p>Behold my beautiful collection.</p>
        </div>
  
        {/* Stats Card */}
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center sm:grid-cols-2 lg:grid-cols-3">
              
              {/* Top 3 */}
              <div className="border-2 border-black p-6 max-w-xs h-64 flex flex-col items-center justify-center gap-y-4">
                <dt className="text-3xl text-gray-600">0</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                <Link
                href="/white"
                className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl"
                >
                  White Cards
                </Link>
                </dd>
              </div>
              <div className="border-2 border-black p-6 max-w-xs h-64 flex flex-col items-center justify-center gap-y-4">
                <dt className="text-3xl text-gray-600">1</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                  Black Cards
                </dd>
              </div>
              <div className="border-2 border-black p-6 max-w-xs h-64 flex flex-col items-center justify-center gap-y-4">
                <dt className="text-3xl text-gray-600">1</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                  Green Cards
                </dd>
              </div>
  
              {/* Bottom 2 (centered under the three) */}
              <div className="lg:col-span-3 flex justify-center gap-x-16">
                <div className="border-2 border-black p-6 max-w-xs h-64 flex flex-col items-center justify-center gap-y-4">
                  <dt className="text-3xl text-gray-600">2</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                    Blue Cards
                  </dd>
                </div>
                <div className="border-2 border-black p-6 max-w-xs h-64 flex flex-col items-center justify-center gap-y-4">
                  <dt className="text-3xl text-gray-600">3</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                    Red Cards
                  </dd>
                </div>
              </div>
  
            </dl>
          </div>
        </div>
      </>
    )
  }
  