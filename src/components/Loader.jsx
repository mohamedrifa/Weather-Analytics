// src/components/Loader.jsx
export default function Loader({ label = "Loading..." }) {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
        <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>

      <h2 className="text-xl font-semibold text-blue-400 animate-pulse tracking-wide">
        {label}
      </h2>

      <div className="px-4 py-2 bg-gray-800/60 backdrop-blur-md rounded-xl border border-gray-700 text-sm text-gray-300">
        Please wait ⏳
      </div>
    </div>
  );
}
