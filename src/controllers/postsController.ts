import { Request, Response } from "express";
import pool from "../db";

type Post = {
  title: string;
  body: string;
  tags: string[];
};

/**
 * 포스트 작성
 *
 * POST /api/posts
 *
 * { title, body, tags }
 */
export const write = async (req: Request, res: Response) => {
  // REST API의 Request Body는 req.body에서 조회할 수 있습니다.
  const { title, body, tags }: Post = req.body;

  const post: Post = {
    title: title,
    body: body,
    tags: tags,
  };

  try {
    pool
      .execute("insert into post (title, body, tags) values (?, ?, ?);", [
        title,
        body,
        tags,
      ])
      .then(() => res.json(post));
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};

/* 포스트 목록 조회
GET /api/posts
*/
export const list = async (req: Request, res: Response) => {
  try {
    pool
      .execute("select * from post;")
      .then(([queryResult]) => res.json(queryResult));
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};

/**
 * 특정 포스트 조회
 *
 * GET /api/posts/:id
 */
export const read = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    pool
      .execute("select * from post where id = ?;", [Number(id)])
      .then(([queryResult]: [any, any]) => {
        if (queryResult.length === 0) {
          res.sendStatus(404); // Not Found;
        } else {
          res.json(queryResult);
        }
      });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};

/**
 * 특정 포스트 제거
 *
 * DELETE /api/posts/:id
 */
export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    pool
      .execute("delete from post where id = ?;", [Number(id)])
      .then(() => res.sendStatus(204)); // No content (성공하기는 했지만 응답할 데이터는 없음.)
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};

/**
 * 포스트 수정(특정 필드 변경)
 *
 * PATCH /api/posts/:id
 *
 * { title, body, tags }
 */
export const update = async (req: Request, res: Response) => {
  // PATCH 메서드는 주어진 필드만 교체합니다.
  const { id } = req.params;
  const { title, body, tags }: Partial<Post> = req.body;

  try {
    const [temp] = await pool.execute("select * from post where id = ?;", [id]);
    const origin: Post = JSON.parse(JSON.stringify(temp))[0];

    pool
      .execute("update post set title = ?, body = ?, tags = ? where id = ?;", [
        title ?? origin.title,
        body ?? origin.body,
        tags ?? origin.tags,
        Number(id),
      ])
      .then(() => res.sendStatus(204)); // No content (성공하기는 했지만 응답할 데이터는 없음.)
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};
