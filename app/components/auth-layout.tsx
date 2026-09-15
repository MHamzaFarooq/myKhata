export default function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-4 py-12"
      style={{
        backgroundColor: "#141617",
        backgroundImage:
          "radial-gradient(900px circle at 18% -10%, rgba(140, 255, 0, 0.16), transparent 55%), " +
          "radial-gradient(700px circle at 85% 105%, rgba(150, 255, 4, 0.12), transparent 55%)",
      }}
    >
      <div className="mb-8 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#8CFF00] text-[15px] font-bold text-[#0b1620]">
          M
        </div>
        <span className="text-[16px] font-medium text-white">MyKhata</span>
      </div>

      <div className="w-full max-w-md rounded-[32px] bg-[#101d27] p-8 shadow-2xl shadow-black/30">
        <div className="mb-8 text-center">
          <h1 className="text-[26px] font-light text-white">{title}</h1>
          <p className="mt-1.5 text-sm text-white/40">{subtitle}</p>
        </div>

        {children}
      </div>
    </main>
  );
}
