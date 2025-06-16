import Link from 'next/link';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex gap-8">
        <div className="w-64">
          <nav className="space-y-1">
            <Link
              href="/settings/profile"
              className="block px-4 py-2 rounded-md hover:bg-gray-100"
            >
              Profile
            </Link>
            <Link
              href="/settings/account"
              className="block px-4 py-2 rounded-md hover:bg-gray-100"
            >
              Account
            </Link>
            <Link
              href="/settings/notifications"
              className="block px-4 py-2 rounded-md hover:bg-gray-100"
            >
              Notifications
            </Link>
          </nav>
        </div>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
} 