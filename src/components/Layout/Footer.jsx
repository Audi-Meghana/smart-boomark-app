export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-3 gap-8 text-sm">
        
        <div>
          <h4 className="text-white font-semibold mb-3">
            SmartBookmarks
          </h4>
          <p className="text-gray-400">
            A modern bookmark manager with secure login and real-time sync.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Product</h4>
          <ul className="space-y-2">
            <li>Features</li>
            <li>How it works</li>
            <li>Dashboard</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Built With</h4>
          <ul className="space-y-2">
            <li>React + Vite</li>
            <li>Supabase</li>
            <li>Google OAuth</li>
            <li>Tailwind CSS</li>
          </ul>
        </div>

      </div>

      <div className="text-center text-gray-500 text-xs mt-10">
        © 2026 SmartBookmarks. All rights reserved.
      </div>
    </footer>
  );
}