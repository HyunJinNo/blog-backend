import { Request, Response, NextFunction } from "express";
import pool from "../db/db";
import { Post } from "../models/Post";

/**
 * ID 검증 미들웨어
 */
export const checkId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const num = Number(id);
    if (Number.isNaN(num)) {
      throw new Error("Number Format Error");
    } else {
      next();
    }
  } catch (e) {
    res.sendStatus(400);
  }
};

/**
 * Request Body 검증 미들웨어
 */
export const checkRequestBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, body, tags } = req.body;
    if (
      typeof title === "string" &&
      typeof body === "string" &&
      Array.isArray(tags)
    ) {
      next();
    } else {
      throw Error("Type Mismatch");
    }
  } catch (e) {
    res.sendStatus(400); // Bad Request
  }
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
      .execute(
        `insert into post (title, body, tags) values ("${title}", "${body}", '${JSON.stringify(
          tags,
        )}');`,
      )
      .then(() => res.json(post));
  } catch (e) {
    res.sendStatus(500);
  }
};

/**
 * 최신 포스트 목록 10개 조회
 *
 * GET /api/posts
 */
export const list = async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1); // 기본값: page = 1

  try {
    const [queryResult]: [Array<any>, any] = await pool.execute(
      `select * from post order by id desc limit ${(page - 1) * 10}, 10;`,
    );

    // 최대 200자까지만 body 조회
    const result = queryResult.map((post: Post) => ({
      ...post,
      body:
        post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`,
    }));

    res.json(result);
  } catch (e) {
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
    const [queryResult]: [Array<any>, any] = await pool.execute(
      `select * from post where id = ${id};`,
    );

    if (queryResult.length === 0) {
      res.sendStatus(404); // Not Found;
      return;
    }

    const [postCount]: [Array<any>, any] = await pool.execute(
      `select count(id) from post;`,
    );
    const lastPage: number = postCount[0]["count(id)"];
    res.setHeader("lastPage", lastPage).send(queryResult);
  } catch (e) {
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
      .execute(`delete from post where id = ${id};`)
      .then(() => res.sendStatus(204)); // No content (성공하기는 했지만 응답할 데이터는 없음.)
  } catch (e) {
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
    const [temp]: [Array<any>, any] = await pool.execute(
      `select * from post where id = ${id};`,
    );
    const origin: Post = temp[0];

    pool
      .execute(
        `update post set title = "${title ?? origin.title}", body = "${
          body ?? origin.body
        }", tags = '${JSON.stringify(tags ?? origin.tags)}' where id = ${id};`,
      )
      .then(() => res.sendStatus(204)); // No content (성공하기는 했지만 응답할 데이터는 없음.)
  } catch (e) {
    res.sendStatus(500);
  }
};
