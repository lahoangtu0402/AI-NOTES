#!/usr/bin/env node
/**
 * Tạo nhanh bài viết hoặc môn học mới từ template.
 *
 *   npm run new -- lecture   thi-giac-may-tinh "Phát hiện đối tượng"
 *   npm run new -- paper     thi-giac-may-tinh "Vision Transformer"
 *   npm run new -- algorithm thuat-toan        "DBSCAN"
 *   npm run new -- course    nlp               "Xử lý ngôn ngữ tự nhiên"
 *
 * Loại bài: lecture | paper | report | exam | algorithm | concept | guide
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const types = ['lecture', 'paper', 'report', 'exam', 'algorithm', 'concept', 'guide'];

const [kind, target, ...rest] = process.argv.slice(2);
const title = rest.join(' ').trim();

function fail(msg) {
  console.error(`Lỗi: ${msg}`);
  process.exit(1);
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/đ/g, 'd')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const usage = `Cách dùng:
  npm run new -- <loại-bài> <mã-môn> "Tiêu đề"
  npm run new -- course <mã-môn> "Tên môn học"

Loại bài: ${types.join(', ')}`;

if (!kind || !target || !title) fail(usage);

if (kind === 'course') {
  const id = slugify(target);
  const file = join(root, 'src/content/courses', `${id}.md`);
  if (existsSync(file)) fail(`Môn "${id}" đã tồn tại: ${file}`);
  writeFileSync(
    file,
    `---
title: ${JSON.stringify(title)}
short: ${JSON.stringify(title.length > 14 ? title.slice(0, 12).trim() + '…' : title)}
description: "Mô tả ngắn về môn học (một đến hai câu)."
kind: course          # course = môn học theo học kỳ, library = thư viện dùng chung
icon: code            # vision | network | algorithm | concept | research | math | code | data
semester: Học kỳ 1 · 2026–2027
order: 100
---

Giới thiệu môn học, mục tiêu và thứ tự đọc gợi ý.
`,
  );
  mkdirSync(join(root, 'src/content/notes', id), { recursive: true });
  console.log(`Đã tạo môn: src/content/courses/${id}.md`);
  console.log('Nhớ chỉnh lại mô tả, icon và tên ngắn (short).');
  process.exit(0);
}

if (!types.includes(kind)) fail(`Loại bài "${kind}" không hợp lệ.\n\n${usage}`);

const courseId = slugify(target);
if (!existsSync(join(root, 'src/content/courses', `${courseId}.md`))) {
  fail(`Chưa có môn "${courseId}". Tạo trước bằng: npm run new -- course ${courseId} "Tên môn"`);
}

const slug = slugify(title);
if (!slug) fail('Tiêu đề không hợp lệ.');
const dir = join(root, 'src/content/notes', courseId);
const file = join(dir, `${slug}.md`);
if (existsSync(file)) fail(`Bài đã tồn tại: ${file}`);

const template = readFileSync(join(root, 'templates', `${kind}.md`), 'utf8')
  .replaceAll('{{title}}', title.replaceAll('"', '\\"'))
  .replaceAll('{{course}}', courseId)
  .replaceAll('{{slug}}', slug);

mkdirSync(dir, { recursive: true });
writeFileSync(file, template);
console.log(`Đã tạo: src/content/notes/${courseId}/${slug}.md`);
