import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500">Page non trouvée</h1>
        <p className="text-lg mt-4 text-gray-600">
          Désolé, la page que vous cherchez n'existe pas.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
