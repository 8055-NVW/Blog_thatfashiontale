import Like from "@/models/Like";
import { createRunOnce } from "@/lib/runOnce";

export const ensureLikeIndexes = createRunOnce(async () => {
  await Like.syncIndexes();
});
