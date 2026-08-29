import { Icon } from "@/components/Icon";
import { SupportForm } from "@/components/SupportForm";

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
        <SupportForm />
      </div>
    </div>
  );
}
