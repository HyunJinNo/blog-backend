import { Request, Response, NextFunction } from "express";
import pool from "../db/db";
import Post from "../models/Post";
import { removeHtmlAndShorten } from "../utils/utils";
import sanitizeHtml from "sanitize-html";
import sanitizeOption from "../constants/sanitizeOption";

/**
 * ID 검증 미들웨어
 */
export const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  try {
    const num = Number(id);
    if (Number.isNaN(num)) {
      throw new Error("Number Format Error");
    }
  } catch (e) {
    res.sendStatus(400);
    return;
  }

  try {
    const [queryResult]: [Array<any>, any] = await pool.execute(
      `select * from post where id = ${id}`,
    );
    if (queryResult.length === 0) {
      throw Error("Not Found");
    }

    res.locals.post = queryResult[0];
    next();
  } catch (e) {
    res.sendStatus(404); // Not Found
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
 * 로그인 중인 사용자가 작성한 포스트인지 확인하는 미들웨어
 */
export const checkOwnPost = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { user, post } = res.locals;
  if (user.id !== post.user_id) {
    res.sendStatus(403); // Forbidden
    return;
  }
  next();
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

  try {
    const tagsJSON = JSON.stringify(tags);
    const filteredBody = sanitizeHtml(body, sanitizeOption);

    await pool.execute(
      `insert into post (title, body, tags, user_id) values ("${title}", "${filteredBody}", '${tagsJSON}', ${res.locals.user.id});`,
    );

    const [queryResult]: [Array<any>, any] = await pool.execute(
      "select id, title, body, tags, user_id from post " +
        `where title = "${title}" and body = "${filteredBody}" and user_id = ${res.locals.user.id} order by id desc;`,
    );
    res.json(queryResult[0]);
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

  // select p.id, p.title, p.body, p.tags, p.user_id, u.username from post as p left join user as u on p.user_id = u.id;
  //const username = req.query.username ?? "";

  // *********************************************
  // TODO: const tag = req.query.tag ?? "";
  // *********************************************

  if (page < 1 || Number.isNaN(page)) {
    res.sendStatus(400);
    return;
  }

  try {
    const [queryResult]: [Array<any>, any] = await pool.execute(
      `select * from post order by id desc limit ${(page - 1) * 10}, 10;`,
    );

    // 최대 200자까지만 body 조회
    const result = queryResult.map((post: Post) => ({
      ...post,
      body: removeHtmlAndShorten(post.body),
    }));

    const [postCount]: [Array<any>, any] = await pool.execute(
      `select count(id) from post;`,
    );
    const lastPage: number = postCount[0]["count(id)"];

    res.setHeader("lastPage", lastPage).json(result);
  } catch (e) {
    res.sendStatus(500);
  }
};

/**
 * 특정 포스트 조회
 *
 * GET /api/posts/:id
 */
export const read = (req: Request, res: Response) => {
  res.send(res.locals.post);
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

    let filteredBody: string | null = null;
    if (body !== undefined) {
      filteredBody = sanitizeHtml(body, sanitizeOption);
    }

    pool
      .execute(
        `update post set title = "${title ?? origin.title}", body = "${
          filteredBody ?? origin.body
        }", tags = '${JSON.stringify(tags ?? origin.tags)}' where id = ${id};`,
      )
      .then(() => res.sendStatus(204)); // No content (성공하기는 했지만 응답할 데이터는 없음.)
  } catch (e) {
    res.sendStatus(500);
  }
};
