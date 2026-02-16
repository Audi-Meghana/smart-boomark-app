export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Login
        </h1>

        <button className="w-full bg-black text-white py-2 rounded">
          Sign in with Google
        </button>
      </div>
    </div>
  );
}