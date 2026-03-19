import { ErrorComponentProps } from "@tanstack/react-router";

export function PrestigeErrorComponent({ error }: ErrorComponentProps) {
  if (!import.meta.env.DEV) {
    return (
      <div className="text-xl my-10 font-bold text-red-500">
        <p>An unexpected error has occurred. Please try refreshing the page.</p>
        <p>If the issue persists, please report it to our repo.</p>
      </div>
    );
  }

  const err = error as any;
  const message = err.message || String(error);
  const file = err.file || "Unknown file";
  const snippet = err.snippet;

  return (
    <div className="h-screen w-screen fixed z-[99999] left-0 top-0 bottom-0 right-0 bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4 lg:p-8 overflow-y-auto">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-900 border border-red-200 dark:border-red-900/50 rounded-lg shadow-xl overflow-hidden">
        <div className="px-6 py-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-900/50">
          <h1 className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
            Compile Error
          </h1>
        </div>
        <div className="p-6 flex flex-col gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">File</span>
            <p className="font-mono text-sm text-gray-800 dark:text-gray-200 mt-1">{file}</p>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Message</span>
            <p className="text-gray-800 dark:text-gray-200 mt-1">{message}</p>
          </div>
          {snippet && (
            <pre className="bg-gray-900 text-red-400 p-4 rounded-md overflow-x-auto text-sm font-mono leading-relaxed">
              <code>{snippet}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
