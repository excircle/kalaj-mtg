export default function Register() {
    const test = {}
    return (
      <>
        {/* Register Card */}
        <div>
            <p className="flex items-center justify-center py-10 px-10 bg-slate-200">Tucia Beducia</p>
        </div>
        <div className="flex items-center justify-center py-10 px-10 bg-slate-200">
          <pre>{JSON.stringify(test, null, 2)}</pre>
        </div>
      </>
    )
  }
  