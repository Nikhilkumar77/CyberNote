import { useEffect, useState } from 'react';
import { supabase, Note } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit2, Trash2, LogOut, Save, X } from 'lucide-react';

export function NotesList() {
  const { user, signOut } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    try {
      const { error } = await supabase
        .from('notes')
        .insert([{
          user_id: user!.id,
          title: formData.title,
          content: formData.content
        }]);

      if (error) throw error;

      setFormData({ title: '', content: '' });
      setIsCreating(false);
      await loadNotes();
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Failed to create note');
    }
  };

  const handleUpdate = async () => {
    if (!editingNote || !formData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    try {
      const { error } = await supabase
        .from('notes')
        .update({
          title: formData.title,
          content: formData.content,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingNote.id);

      if (error) throw error;

      setEditingNote(null);
      setFormData({ title: '', content: '' });
      await loadNotes();
    } catch (error) {
      console.error('Error updating note:', error);
      alert('Failed to update note');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note');
    }
  };

  const startEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({ title: note.title, content: note.content });
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingNote(null);
    setFormData({ title: '', content: '' });
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setIsCreating(false);
    setFormData({ title: '', content: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Cyber Notes</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={startCreate}
            disabled={isCreating || editingNote !== null}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            New Note
          </button>
        </div>

        {(isCreating || editingNote) && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isCreating ? 'Create New Note' : 'Edit Note'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter note title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="Enter note content"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={isCreating ? handleCreate : handleUpdate}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  <Save className="w-4 h-4" />
                  {isCreating ? 'Create' : 'Save'}
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {notes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-500 text-lg">No notes yet. Create your first note!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {note.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-4 whitespace-pre-wrap">
                  {note.content || 'No content'}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{new Date(note.created_at).toLocaleDateString()}</span>
                  {note.updated_at !== note.created_at && (
                    <span className="text-xs">Updated</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(note)}
                    className="flex items-center gap-2 flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg transition font-medium"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="flex items-center gap-2 flex-1 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg transition font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
