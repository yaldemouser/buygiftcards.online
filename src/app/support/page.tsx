import { Icon } from "@/components/Icon";

export default function SupportPage() {
  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="bg-white border border-ink-100 rounded-3xl p-10 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
            <Icon name="messageCircle" size={26} className="text-brand-600" />
          </div>
          <h1 className="text-2xl font-extrabold">Contact Support</h1>
        </div>
        <form className="space-y-4">
          {["Full Name", "Email Address", "Order Number (optional)"].map((f) => (
            <div key={f}>
              <label className="text-xs font-bold text-ink-600 uppercase block mb-1.5">{f}</label>
              <input placeholder={f} className="w-full px-4 py-3 border-2 border-ink-100 rounded-xl bg-ink-50 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition" />
            </div>
          ))}
          <div>
            <label className="text-xs font-bold text-ink-600 uppercase block mb-1.5">Describe your issue</label>
            <textarea rows={4} className="w-full px-4 py-3 border-2 border-ink-100 rounded-xl bg-ink-50 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition" />
          </div>
          <button type="button" className="w-full py-3.5 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition">
            Submit Request
          </button>
          <p className="text-xs text-ink-400 text-center">
            This form isn't wired to a ticketing system yet — hook it up to email or a helpdesk before launch.
          </p>
        </form>
      </div>
    </div>
  );
}
