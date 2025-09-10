import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, Link, json, redirect, useLoaderData, useNavigation } from "@remix-run/react";
import { deleteNote, getNote, type Note } from "~/utils/noteStore";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = data?.note?.title ? `${data.note.title} • Personal Notes` : "Note • Personal Notes";
  return [
    { title },
    { name: "description", content: "View a note." },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id ?? "";
  const note = getNote(id);
  if (!note) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ note });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const form = await request.formData();
  const intent = form.get("_intent");
  const id = params.id ?? "";
  if (!id) return new Response(null, { status: 400 });

  if (intent === "delete") {
    deleteNote(id);
    return redirect("/");
  }

  return new Response(null, { status: 400 });
}

export default function NoteDetailRoute() {
  const { note } = useLoaderData<typeof loader>() as { note: Note };
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <Link
          to="/"
          className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800"
        >
          ← Back
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to={`/notes/${note.id}/edit`}
            className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            Edit
          </Link>
          <Form method="post">
            <input type="hidden" name="_intent" value="delete" />
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-70"
            >
              Delete
            </button>
          </Form>
        </div>
      </div>

      <article>
        <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
          {note.title || "(Untitled)"}
        </h1>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Last updated {new Date(note.updatedAt).toLocaleString()}
        </p>
        <div className="prose max-w-none whitespace-pre-wrap dark:prose-invert">
          {note.content}
        </div>
      </article>
    </div>
  );
}
