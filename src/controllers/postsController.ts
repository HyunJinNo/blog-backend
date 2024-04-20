import { Request, Response } from "express";

let postId = 1; // id의 초깃값

// posts 배열 초기 데이터
const posts = [
  {
    id: 1,
    title: "제목",
    body: "내용",
  },
];

/**
 * 포스트 작성
 *
 * POST /api/posts
 *
 * { title, body }
 */
export const write = (req: Request, res: Response) => {
  // REST API의 Request Body는 req.body에서 조회할 수 있습니다..
  const { title, body } = req.body;
  postId++; // 기존 postId 값에 1을 더합니다.

  const post = {
    id: postId,
    title: title,
    body: body,
  };

  posts.push(post);
  res.json(post);
};

/* 포스트 목록 조회
GET /api/posts
*/
export const list = (req: Request, res: Response) => {
  res.json(posts);
};

/**
 * 특정 포스트 조회
 *
 * GET /api/posts/:id
 */
export const read = (req: Request, res: Response) => {
  const { id } = req.params;

  // 주어진 id 값으로 포스트를 찾습니다..
  // 파라미터로 받아 온 값은 문자열 형식이르모 파라미터를 숫자로 변환하거나
  // 비교할 p.id 값을 문자열로 변경해야 합니다.
  const post = posts.find((p) => p.id.toString() === id);

  // 포스트가 없으면 오류를 반환합니다..
  if (!post) {
    res.status(404).json({
      message: "포스트가 존재하지 않습니다.",
    });
    return;
  }

  res.json(post);
};

/**
 * 특정 포스트 제거
 *
 * DELETE /api/posts/:id
 */
export const remove = (req: Request, res: Response) => {
  const { id } = req.params;

  // 해당 id를 가진 포스트가 몇 번째인지 확인합니다.
  const index = posts.findIndex((p) => p.id.toString() === id);

  // 포스트가 없으면 오류를 반환합니다.
  if (index === -1) {
    res.status(404).json({
      message: "포스트가 존재하지 않습니다.",
    });
    return;
  }

  // index 번째 아이템을 제거합니다.
  posts.splice(index, 1);
  res.sendStatus(204); // No Content
};

/**
 * 포스트 수정(교체)
 *
 * PUT /api/posts/:id
 *
 * { title, body }
 */
export const replace = (req: Request, res: Response) => {
  // PUT 메서드는 전체 포스트 정보를 입력하여 데이터를 통째로 교체할 때 사용합니다.
  const { id } = req.params;
  const { title, body } = req.body;

  // 해당 id를 가진 포스트가 몇 번째인지 확인합니다.
  const index = posts.findIndex((p) => p.id.toString() === id);

  // 포스트가 없으면 오류를 반환합니다.
  if (index === -1) {
    res.status(404).json({
      message: "포스트가 존재하지 않습니다.",
    });
    return;
  }

  // 전체 객체를 덮어 씌웁니다.
  // 따라서 id를 제외한 기존 정보를 날리고, 객체를 새로 만듭니다.
  posts[index] = {
    id: Number(id),
    title: title,
    body: body,
  };

  res.json(posts[index]);
};

/**
 * 포스트 수정(특정 필드 변경)
 *
 * PATCH /api/posts/:id
 *
 * { title, body }
 */
export const update = (req: Request, res: Response) => {
  // PATCH 메서드는 주어진 필드만 교체합니다.
  const { id } = req.params;
  const { title, body }: { title?: string; body?: string } = req.body;

  // 해당 id를 가진 포스트가 몇 번째인지 확인합니다.
  const index = posts.findIndex((p) => p.id.toString() === id);

  // 포스트가 없으면 오류를 반환합니다.
  if (index === -1) {
    res.status(404).json({
      message: "포스트가 존재하지 않습니다.",
    });
    return;
  }

  // 기존 값에 정보를 덮어 씌웁니다.
  posts[index] = {
    ...posts[index],
    title: title ?? posts[index].title,
    body: body ?? posts[index].body,
  };

  res.json(posts[index]);
};
