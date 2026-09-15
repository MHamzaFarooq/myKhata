import { updateUsernameById } from "../repositories/userRepository";
import { getCurrentUser } from "../session";

export async function updateUsernameService(username: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const updated = await updateUsernameById(user.id, username);
  if (!updated) {
    throw new Error("User not found");
  }

  return updated;
}
