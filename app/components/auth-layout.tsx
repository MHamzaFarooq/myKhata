import Image from "next/image";

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
      <div className="mb-8">
        <Image src="/mykhata-logo.svg" alt="MyKhata" width={144} height={24} priority />
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
