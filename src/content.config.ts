import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Hai collection:
 *  - courses: thông tin của từng môn học / thư viện (một file .md cho mỗi môn)
 *  - notes:   các bài viết (bài giảng, paper, báo cáo, thuật toán, khái niệm...)
 *
 * Thêm môn mới = thêm một file vào src/content/courses/
 * và một thư mục cùng tên trong src/content/notes/.
 */

const courses = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/courses' }),
  schema: z.object({
    title: z.string(),
    short: z.string(), // tên ngắn hiển thị trong sidebar
    description: z.string(),
    // course = môn học theo học kỳ, library = thư viện dùng chung (thuật toán, khái niệm...)
    kind: z.enum(['course', 'library']).default('course'),
    icon: z.enum([
      'vision',
      'network',
      'algorithm',
      'concept',
      'research',
      'math',
      'code',
      'data',
    ]),
    semester: z.string().optional(), // ví dụ "Học kỳ 1 · 2026–2027"
    order: z.number().default(100),
  }),
});

export const NOTE_TYPES = [
  'lecture',
  'paper',
  'report',
  'exam',
  'algorithm',
  'concept',
  'guide',
] as const;

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(), // 1–2 câu, hiển thị trên thẻ và trong kết quả tìm kiếm
    course: z.string(), // trùng với id của file trong src/content/courses
    type: z.enum(NOTE_TYPES),
    tags: z.array(z.string()).default([]),
    level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
    status: z.enum(['draft', 'reviewed']).default('draft'),
    // private: chỉ xem được khi chạy `npm run dev`, không đưa vào bản build
    visibility: z.enum(['public', 'private']).default('public'),
    // Truy vết về file gốc (nằm trong _sources/, không công khai)
    source: z.string().optional(),
    sourceTitle: z.string().optional(),
    lecturer: z.string().optional(),
    // Với paper: liên kết công khai tới bài báo
    paperUrl: z.string().url().optional(),
    paperAuthors: z.string().optional(),
    paperYear: z.number().optional(),
    // Quan hệ giữa các bài (dùng id dạng "course/ten-bai")
    prerequisites: z.array(z.string()).default([]),
    usedIn: z.array(z.string()).default([]),
    related: z.array(z.string()).default([]),
    order: z.number().default(100), // thứ tự trong cùng một môn
    // Nếu không phải repo Git hoặc muốn ghi đè ngày cập nhật (YYYY-MM-DD)
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { courses, notes };
