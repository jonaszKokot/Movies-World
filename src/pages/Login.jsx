import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: email,
        password: password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      alert('Zalogowano pomyślnie!');
      
      window.location.href = '/'; 

    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Błąd logowania');
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-zinc-900 text-white rounded-xl border border-zinc-800">
      <h2 className="text-2xl font-bold mb-6 text-center text-yellow-500">Logowanie</h2>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 text-red-200 text-sm rounded">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white focus:outline-none focus:border-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Hasło</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white focus:outline-none focus:border-yellow-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded transition"
        >
          Zaloguj się
        </button>
        <label>
            <p className='flex justify-center gap-4 text-sm'>
                Nie masz konta?
                <Link to="/register" className='hover:underline'>Zarejestruj się</Link>
            </p>
        </label>
      </form>
    </div>
  );
}