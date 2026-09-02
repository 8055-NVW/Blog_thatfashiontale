import assert from "node:assert/strict";
import test from "node:test";

const { applyDiscussionOwnershipState } = await import(
  new URL("./discussionOwnershipState.ts", import.meta.url).href
);

test("applyDiscussionOwnershipState marks owned comments and replies", () => {
  const result = applyDiscussionOwnershipState(
    [
      {
        _id: "comment-1",
        content: "First comment",
        user: { _id: "user-1", name: "Author" },
        replies: [
          {
            _id: "reply-1",
            content: "Owned reply",
            user: { _id: "user-1", name: "Author" },
          },
          {
            _id: "reply-2",
            content: "Other reply",
            user: { _id: "user-2", name: "Reader" },
          },
        ],
      },
      {
        _id: "comment-2",
        content: "Second comment",
        user: { _id: "user-2", name: "Reader" },
      },
    ],
    "user-1"
  );

  assert.equal(result[0]?.isOwner, true);
  assert.equal(result[0]?.replies?.[0]?.isOwner, true);
  assert.equal(result[0]?.replies?.[1]?.isOwner, false);
  assert.equal(result[1]?.isOwner, false);
});

test("applyDiscussionOwnershipState defaults to false when no session user exists", () => {
  const result = applyDiscussionOwnershipState(
    [
      {
        _id: "comment-1",
        content: "First comment",
        user: { _id: "user-1", name: "Author" },
      },
    ],
    undefined
  );

  assert.equal(result[0]?.isOwner, false);
});
