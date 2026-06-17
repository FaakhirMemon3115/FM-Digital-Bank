"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.refresh();
  };

  return (
    <div className="min-h-screen p-8 bg-slate-50 dark:bg-slate-900">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-2xl font-bold text-blue-600">FM Digital Bank</h1>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <span className="font-medium text-slate-700 dark:text-slate-200">
                Welcome, {user.firstName} {user.lastName}
              </span>
              <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600">
                Login
              </Link>
              <Link href="/register" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                Register
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        {!user ? (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold mb-4">Welcome to FM Digital Bank</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              The simplest and most secure way to manage your money.
            </p>
            <Link href="/register" className="px-8 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700">
              Get Started Now
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h2 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-200">Total Balance</h2>
                <p className="text-4xl font-bold text-slate-900 dark:text-white">$0.00</p>
                <div className="mt-8 flex gap-4">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium">Send Money</button>
                  <button className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white py-3 rounded-xl font-medium">Add Money</button>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h2 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-200">Quick Actions</h2>
                <div className="flex flex-col gap-3">
                  <button className="text-left px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-200 border border-transparent">Pay Bills</button>
                  <button className="text-left px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-200 border border-transparent">Cards</button>
                  <button className="text-left px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-200 border border-transparent">Settings</button>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-200">Recent Transactions</h2>
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                No transactions yet. Start sending money!
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
