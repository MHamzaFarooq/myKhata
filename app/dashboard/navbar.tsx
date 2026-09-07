import { logoutUser } from "./actions";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-[16px] font-medium">MyKhata</h1>
      <form action={logoutUser}>
        <div className="py-2 px-4 rounded-full bg-[#20313D]">
          <button className="text-[14px]" type="submit">
            Logout
          </button>
        </div>
      </form>
    </div>
  );
}
