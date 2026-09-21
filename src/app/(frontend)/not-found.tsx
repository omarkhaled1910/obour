import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-4 px-6">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <Link className="underline" href="/">
        Back home
      </Link>
    </main>
  )
}
