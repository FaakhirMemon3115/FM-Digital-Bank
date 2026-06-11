export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-2xl font-bold text-primary">FM Digital Bank</h1>
        <div className="flex gap-4">
          <button className="px-4 py-2 rounded-lg bg-secondary text-white">Login</button>
          <button className="px-4 py-2 rounded-lg bg-primary text-white">Register</button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2 bg-white dark:bg-secondary p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-semibold mb-4">Total Balance</h2>
            <p className="text-4xl font-bold">$0.00</p>
            <div className="mt-8 flex gap-4">
              <button className="flex-1 bg-primary text-white py-3 rounded-xl font-medium">Send Money</button>
              <button className="flex-1 bg-slate-100 dark:bg-slate-800 py-3 rounded-xl font-medium">Add Money</button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-secondary p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-3">
              <button className="text-left px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition">Pay Bills</button>
              <button className="text-left px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition">Cards</button>
              <button className="text-left px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition">Settings</button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white dark:bg-secondary p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          <div className="text-center py-8 text-slate-500">
            No transactions yet. Start sending money!
          </div>
        </div>
      </main>
    </div>
  );
}
