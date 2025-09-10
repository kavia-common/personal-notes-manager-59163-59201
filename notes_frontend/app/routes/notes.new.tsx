import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, Link, redirect, useNavigation } from "@remix-run/react";
import { createNote } from "~/utils/noteStore";

export const meta: MetaFunction = () => {
  return [
    { title: "New Note • Personal Notes" },
    { name: "description", content: "Create a new note." },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const title = String(form.get("title") ?? "").trim();
  const content = String(form.get("content") ?? "").trim();

  if (!title && !content) {
    // Basic validation: require some content
    return new Response("Title or content is required", { status: 400 });
  }

  const note = createNote({ title, content });
  return redirect(`/notes/${note.id}`);
}

export default function NewNoteRoute() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Create Note</h2>
        <Link
          to="/"
          className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800"
        >
          Back
        </Link>
      </div>

      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-200">
            Title
          </label>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="Note title"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label htmlFor="content" className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-200">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            placeholder="Write your note..."
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
            {isSubmitting ? "Creating..." : "Create"}
          </button>
          <Link
            to="/"
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </Link>
        </div>
      </Form>
    </div>
  );
}
