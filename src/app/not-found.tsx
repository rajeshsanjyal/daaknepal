import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center bg-paper px-6 text-center">
      <div>
        <p className="text-sm font-semibold text-brand">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-navy">This page is not on the map.</h1>
        <Link href="/" className="mt-6 inline-flex h-12 items-center rounded-xl bg-brand px-5 font-semibold text-white">
          Back to DAAK Nepal
        </Link>
      </div>
    </div>
  );
}
