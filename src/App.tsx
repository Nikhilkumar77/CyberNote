import { useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { NotesList } from './components/NotesList';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return user ? <NotesList /> : <Auth />;
}

export default App;
