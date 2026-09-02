import { Types } from "mongoose";
import { auth } from "@/auth";

export async function requireSessionUserId() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || !Types.ObjectId.isValid(userId)) {
    return null;
  }

  return userId;
}
