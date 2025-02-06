export default function Loading() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-[#B87D3B]/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#B87D3B] rounded-full animate-spin border-t-transparent"></div>
        </div>
        <p className="mt-4 text-neutral-400">Loading...</p>
      </div>
    </div>
  )
} 