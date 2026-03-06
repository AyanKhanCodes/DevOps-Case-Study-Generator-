import "./globals.css";

export const metadata = {
  title: "DevOps Case Study Generator",
  description:
    "Generate randomized DevOps transformation case studies for educational assessment. Built with Next.js, Prisma, and SQLite.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 text-slate-800 min-h-screen">{children}</body>
    </html>
  );
}
