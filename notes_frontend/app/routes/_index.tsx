import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation, useSearchParams } from "@remix-run/react";
import { listNotes, deleteNote, type Note } from "~/utils/noteStore";

export const meta: MetaFunction = () => {
  return [
    { title: "Personal Notes" },
    { name: "description", content: "Create, edit, and manage personal notes." },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? undefined;
  const notes = listNotes(q);
  return { notes, q: q ?? "" };
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const intent = form.get("_intent");
  if (intent === "delete") {
    const id = String(form.get("id") ?? "");
    if (id) {
      deleteNote(id);
    }
    return new Response(null, { status: 204 });
  }
  return new Response(null, { status: 400 });
}

export default function Index() {
  const { notes, q } = useLoaderData<typeof loader>() as { notes: Note[]; q: string };
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";

  return (
    <div className="mx-auto max-w-4xl p-6">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Personal Notes</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Create, edit, and manage your notes.</p>
        </div>
        <Link
          to="/notes/new"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          prefetch="intent"
        >
          + New Note
        </Link>
      </header>

      <div className="mb-4 flex items-center justify-between gap-3">
        <Form method="get" className="flex w-full items-center gap-2">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search notes..."
            className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          />
          {searchParams.get("q") ? (
            <Link
              to="/"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Clear
            </Link>
          ) : null}
          <button
            type="submit"
            className="rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
          >
            Search
          </button>
        </Form>
      </div>

      {notes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center dark:border-gray-700">
          <p className="mb-3 text-gray-700 dark:text-gray-200">No notes found.</p>
          <Link to="/notes/new" className="text-blue-600 underline hover:text-blue-700">
            Create your first note
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {notes.map((n) => (
            <li key={n.id} className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <Link
                to={`/notes/${n.id}`}
                className="mb-2 block text-lg font-semibold text-blue-700 hover:underline dark:text-blue-400"
                prefetch="intent"
              >
                {n.title || "(Untitled)"}
              </Link>
              <p className="mb-3 line-clamp-3 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                {n.content}
              </p>
              <div className="flex items-center gap-2">
                <Link
                  to={`/notes/${n.id}/edit`}
                  className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800"
                >
                  Edit
                </Link>
                <Form method="post" replace>
                  <input type="hidden" name="_intent" value="delete" />
                  <input type="hidden" name="id" value={n.id} />
                  <button
                    type="submit"
                    className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-70"
                    disabled={isSubmitting}
                  >
                    Delete
                  </button>
                </Form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
