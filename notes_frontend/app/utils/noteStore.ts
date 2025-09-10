export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
};

const notes: Record<string, Note> = {};

// Seed with an example note to make the UI non-empty initially
const now = Date.now();
const seedId = "welcome-note";
notes[seedId] = {
  id: seedId,
  title: "Welcome to Personal Notes",
  content:
    "This is your first note. You can create new ones, edit this, or delete it. Have fun!",
  createdAt: now,
  updatedAt: now,
};

// PUBLIC_INTERFACE
export function listNotes(query?: string): Note[] {
  /** List all notes, optionally filtering by a search query (title/content). */
  const all = Object.values(notes).sort((a, b) => b.updatedAt - a.updatedAt);
  if (!query) return all;
  const q = query.toLowerCase();
  return all.filter(
    (n) =>
      n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q),
  );
}

// PUBLIC_INTERFACE
export function getNote(id: string): Note | undefined {
  /** Get a single note by id. Returns undefined if not found. */
  return notes[id];
}

// PUBLIC_INTERFACE
export function createNote(data: { title: string; content: string }): Note {
  /** Create a note and return it. */
  const id = cryptoRandomId();
  const ts = Date.now();
  const note: Note = {
    id,
    title: data.title,
    content: data.content,
    createdAt: ts,
    updatedAt: ts,
  };
  notes[id] = note;
  return note;
}

// PUBLIC_INTERFACE
export function updateNote(
  id: string,
  data: Partial<Pick<Note, "title" | "content">>,
): Note | undefined {
  /** Update a note by id. Returns updated note or undefined if not found. */
  const existing = notes[id];
  if (!existing) return undefined;
  const updated: Note = {
    ...existing,
    title: data.title ?? existing.title,
    content: data.content ?? existing.content,
    updatedAt: Date.now(),
  };
  notes[id] = updated;
  return updated;
}

// PUBLIC_INTERFACE
export function deleteNote(id: string): boolean {
  /** Delete a note by id. Returns true if deleted, false if not found. */
  if (!(id in notes)) return false;
  delete notes[id];
  return true;
}

type GlobalWithCrypto = typeof globalThis & {
  crypto?: {
    randomUUID?: () => string;
  };
};

function cryptoRandomId() {
  // Prefer Web Crypto randomUUID if available
  if (typeof globalThis !== "undefined") {
    const g = globalThis as GlobalWithCrypto;
    if (g.crypto && typeof g.crypto.randomUUID === "function") {
      return g.crypto.randomUUID();
    }
  }
  // Fallback if not available
  return "id-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}
