import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      alert('Zarejestrowano pomyślnie!');
      navigate('/')

    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('Brak połączenia z serwerem. Upewnij się, że backend działa.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-zinc-900 text-white rounded-xl shadow-lg border border-zinc-800">
      <h2 className="text-2xl font-bold mb-6 text-center text-yellow-500">
        Rejestracja w Movies World
      </h2>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 text-red-200 text-sm rounded">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Imię</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:border-yellow-500 text-white"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Nazwisko</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:border-yellow-500 text-white"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Adres Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:border-yellow-500 text-white"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Hasło</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:border-yellow-500 text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded transition disabled:opacity-50"
        >
          {loading ? 'Rejestrowanie...' : 'Zarejestruj się'}
        </button>

        <p className='flex justify-center gap-4 text-sm'>
          Masz konto?
          <Link to="/login" className='hover:underline'>Zaloguj się</Link>
        </p>
      </form>
    </div>
  );
}