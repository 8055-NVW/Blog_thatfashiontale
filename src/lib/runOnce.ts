export function createRunOnce(work: () => Promise<void>) {
  let promise: Promise<void> | null = null;

  return async function runOnce() {
    if (!promise) {
      promise = work().catch((error) => {
        promise = null;
        throw error;
      });
    }

    await promise;
  };
}
