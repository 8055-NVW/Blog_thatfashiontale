import { auth } from "@/auth";

export const GET = async () => {
  const session = await auth();
  if (!session?.user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }
  return new Response(JSON.stringify(session.user), { status: 200 });
};