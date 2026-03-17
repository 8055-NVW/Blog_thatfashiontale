import assert from "node:assert/strict";
import test from "node:test";

const { applyDiscussionLikeState, formatLikeCount } = await import(
  new URL("./discussionLikeState.ts", import.meta.url).href
);

test("applyDiscussionLikeState adds like state to comments and replies", () => {
  const result = applyDiscussionLikeState(
    [
      {
        _id: "comment-1",
        content: "First comment",
        replies: [
          {
            _id: "reply-1",
            content: "First reply",
          },
          {
            _id: "reply-2",
            content: "Second reply",
          },
        ],
      },
      {
        _id: "comment-2",
        content: "Second comment",
      },
    ],
    {
      countById: new Map([
        ["comment-1", 2],
        ["reply-1", 1],
      ]),
      likedIds: new Set(["comment-2", "reply-1"]),
    }
  );

  assert.equal(result[0]?.likeCount, 2);
  assert.equal(result[0]?.hasLiked, false);
  assert.equal(result[0]?.replies?.[0]?.likeCount, 1);
  assert.equal(result[0]?.replies?.[0]?.hasLiked, true);
  assert.equal(result[0]?.replies?.[1]?.likeCount, 0);
  assert.equal(result[0]?.replies?.[1]?.hasLiked, false);
  assert.equal(result[1]?.likeCount, 0);
  assert.equal(result[1]?.hasLiked, true);
});

test("formatLikeCount returns quiet singular and plural labels", () => {
  assert.equal(formatLikeCount(0), "0 likes");
  assert.equal(formatLikeCount(1), "1 like");
  assert.equal(formatLikeCount(2), "2 likes");
});
