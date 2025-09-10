import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, Link, json, redirect, useLoaderData, useNavigation } from "@remix-run/react";
import { getNote, updateNote, type Note } from "~/utils/noteStore";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const base = data?.note?.title ? `Edit "${data.note.title}"` : "Edit Note";
  return [
    { title: `${base} • Personal Notes` },
    { name: "description", content: "Edit a note." },
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
  const id = params.id ?? "";
  const form = await request.formData();
  const title = String(form.get("title") ?? "").trim();
  const content = String(form.get("content") ?? "").trim();

  const updated = updateNote(id, { title, content });
  if (!updated) {
    throw new Response("Not Found", { status: 404 });
  }
  return redirect(`/notes/${id}`);
}

export default function EditNoteRoute() {
  const { note } = useLoaderData<typeof loader>() as { note: Note };
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Edit Note</h2>
        <Link
          to={`/notes/${note.id}`}
          className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800"
        >
          Back
        </Link>
      </div>

      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-200">Title</label>
          <input
            id="title"
            type="text"
            name="title"
            defaultValue={note.title}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label htmlFor="content" className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-200">Content</label>
          <textarea
            id="content"
            name="content"
            defaultValue={note.content}
            rows={10}
            className="w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
          <Link
            to={`/notes/${note.id}`}
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </Link>
        </div>
      </Form>
    </div>
  );
}
