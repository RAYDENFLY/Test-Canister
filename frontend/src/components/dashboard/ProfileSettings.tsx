import React, { useState } from 'react';

export default function ProfileSettings() {
  const [form, setForm] = useState({
    name: 'User Name',
    title: 'Frontend Engineer',
    location: 'Jakarta, ID',
    about: 'Short bio here.'
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setMessage(null);
    // simulate save
    await new Promise((r) => setTimeout(r, 400));
    setSaving(false);
    setMessage('Profile saved (local only)');
  }

  return (
    <div className="bg-gray-50 rounded p-4 border border-gray-100">
      <h3 className="font-semibold mb-2">Profile Settings</h3>
      <div className="space-y-2">
        <input value={form.name} onChange={(e) => setForm(s => ({ ...s, name: e.target.value }))} className="w-full p-2 border rounded" />
        <input value={form.title} onChange={(e) => setForm(s => ({ ...s, title: e.target.value }))} className="w-full p-2 border rounded" />
        <input value={form.location} onChange={(e) => setForm(s => ({ ...s, location: e.target.value }))} className="w-full p-2 border rounded" />
        <textarea value={form.about} onChange={(e) => setForm(s => ({ ...s, about: e.target.value }))} className="w-full p-2 border rounded" rows={3} />
        {message && <div className="text-sm text-green-600">{message}</div>}
        <div className="flex space-x-2">
          <button onClick={save} className="px-3 py-2 bg-blue-600 text-white rounded" disabled={saving} data-testid="button-save-profile">{saving ? 'Saving...' : 'Save'}</button>
          <button onClick={() => setMessage('') } className="px-3 py-2 border rounded" data-testid="button-clear">Clear</button>
        </div>
      </div>
    </div>
  );
}
