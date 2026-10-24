
import { useEffect, useState } from 'react';
import './index.css';

function App() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  const bookImages = {
    'Wings of Fire':
      'https://covers.openlibrary.org/b/title/Wings%20of%20Fire-M.jpg',
    'The Alchemist':
      'https://covers.openlibrary.org/b/title/The%20Alchemist-M.jpg',
    'Atomic Habits':
      'https://covers.openlibrary.org/b/title/Atomic%20Habits-M.jpg',
    'The Psychology of Money':
      'https://covers.openlibrary.org/b/title/The%20Psychology%20of%20Money-M.jpg',
    Ikigai:
      'https://covers.openlibrary.org/b/title/Ikigai-M.jpg'
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/books')
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.log(error));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');

    const endpoint =
      page === 'register' ? 'register' : 'login';

    const details =
      page === 'register'
        ? { name, email, password }
        : { email, password };

    try {
      const url = 'http://localhost:5000/api/' + endpoint;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(details)
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Something went wrong');
        return;
      }

      if (page === 'register') {
        setMessage('Registration successful! Please log in.');
        setPage('login');
        setPassword('');
      } else {
        setUser(data.user);
        setMessage('');
        setPassword('');
      }
    } catch (error) {
      setMessage('Cannot connect to the backend server.');
    }
  }

  function logout() {
    setUser(null);
    setPage('login');
    setName('');
    setEmail('');
    setPassword('');
    setSearch('');
    setMessage('You have logged out.');
  }

  if (!user) {
    return (
      <div className="auth-page">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h1>Online Bookstore</h1>

          <p>
            {page === 'register'
              ? 'Create your account'
              : 'Welcome back!'}
          </p>

          {page === 'register' && (
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password (minimum 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />

          <button type="submit">
            {page === 'register' ? 'Register' : 'Login'}
          </button>

          {message && <p className="message">{message}</p>}

          <p>
            {page === 'register'
              ? 'Already have an account?'
              : "Don't have an account?"}
          </p>

          <button
            type="button"
            className="switch-button"
            onClick={() => {
              setPage(page === 'register' ? 'login' : 'register');
              setMessage('');
            }}
          >
            {page === 'register' ? 'Go to Login' : 'Create Account'}
          </button>
        </form>
      </div>
    );
  }

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <header>
        <h1>Online Bookstore</h1>
        <p>Welcome, {user.name}!</p>
        <button onClick={logout}>Logout</button>
      </header>

      <input
        type="text"
        placeholder="Search by title or author..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h2>Available Books</h2>

      <div className="book-list">
        {filteredBooks.map((book) => (
          <div className="book-card" key={book._id}>
            <img
              className="book-cover"
              src={
                book.image ||
                bookImages[book.title] ||
                'https://placehold.co/150x220?text=Book'
              }
              alt={book.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  'https://placehold.co/150x220?text=Book';
              }}
            />

            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>Price: ₹{book.price}</p>
            <p>
              {book.available ? 'Available' : 'Out of stock'}
            </p>
          </div>
        ))}

        {filteredBooks.length === 0 && (
          <p>No books found.</p>
        )}
      </div>
    </div>
  );
}

export default App;