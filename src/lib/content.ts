import { getCollection, type CollectionEntry } from 'astro:content';
import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';

export type Course = CollectionEntry<'courses'>;
export type Note = CollectionEntry<'notes'>;

/* ---------- Nhãn tiếng Việt ---------- */

export const typeLabels: Record<Note['data']['type'], string> = {
  lecture: 'Bài giảng',
  paper: 'Bài báo',
  report: 'Báo cáo',
  exam: 'Ôn tập kiểm tra',
  algorithm: 'Thuật toán',
  concept: 'Khái niệm',
  guide: 'Hướng dẫn',
};

// Thứ tự hiển thị các nhóm trong trang môn học
export const typeOrder: Note['data']['type'][] = [
  'guide',
  'lecture',
  'algorithm',
  'concept',
  'paper',
  'report',
  'exam',
];

export const levelLabels: Record<Note['data']['level'], string> = {
  beginner: 'Cơ bản',
  intermediate: 'Trung bình',
  advanced: 'Nâng cao',
};

export const statusLabels: Record<Note['data']['status'], string> = {
  draft: 'Bản nháp',
  reviewed: 'Đã rà soát',
};

/* ---------- Đường dẫn ---------- */

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Ghép đường dẫn với base (dùng khi deploy vào thư mục con, ví dụ GitHub Pages). */
export function url(path = '/'): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

export const noteSlug = (n: Note) => n.id.split('/').pop()!;
export const noteKey = (n: Note) => `${n.data.course}/${noteSlug(n)}`;
export const noteHref = (n: Note) => url(`/${noteKey(n)}/`);
export const courseHref = (c: Course) => url(`/${c.id}/`);
export const tagHref = (tag: string) => url(`/tags/${encodeURIComponent(tag)}/`);

/* ---------- Truy vấn nội dung ---------- */

// Bản build (production) bỏ các bài `visibility: private`; khi dev thì hiện hết.
const showPrivate = !import.meta.env.PROD;

export async function getCourses(): Promise<Course[]> {
  const all = await getCollection('courses');
  return all.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title, 'vi'));
}

export async function getNotes(): Promise<Note[]> {
  const all = await getCollection('notes');
  return all.filter((n) => showPrivate || n.data.visibility === 'public');
}

export async function getNotesOfCourse(courseId: string): Promise<Note[]> {
  const all = await getNotes();
  return all
    .filter((n) => n.data.course === courseId)
    .sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title, 'vi'));
}

/** Tạo bảng tra cứu "course/slug" -> bài viết, dùng cho prerequisites / usedIn / related. */
export async function getNoteIndex(): Promise<Map<string, Note>> {
  const all = await getNotes();
  return new Map(all.map((n) => [noteKey(n), n]));
}

/** Các bài khác có khai báo `usedIn` hoặc `prerequisites` trỏ về bài này (liên kết hai chiều). */
export function backlinks(target: Note, all: Note[]) {
  const key = noteKey(target);
  return {
    usedBy: all.filter((n) => n !== target && n.data.prerequisites.includes(key)),
    mentionedIn: all.filter((n) => n !== target && target.data.usedIn.includes(noteKey(n))),
  };
}

export async function getTags(): Promise<Map<string, Note[]>> {
  const all = await getNotes();
  const map = new Map<string, Note[]>();
  for (const n of all) {
    for (const t of n.data.tags) {
      map.set(t, [...(map.get(t) ?? []), n]);
    }
  }
  return new Map([...map.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0])));
}

/* ---------- Ngày cập nhật (theo lịch sử Git) ---------- */

const dateCache = new Map<string, Date | null>();

/**
 * Ưu tiên: `updated` trong frontmatter → commit gần nhất của file → thời gian sửa file.
 * Khi deploy bằng GitHub Actions, nhớ checkout với `fetch-depth: 0` để có đủ lịch sử.
 */
export function lastUpdated(note: Note): Date | null {
  if (note.data.updated) return note.data.updated;
  const file = note.filePath;
  if (!file) return null;
  if (dateCache.has(file)) return dateCache.get(file)!;

  let result: Date | null = null;
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
    if (out) result = new Date(out);
  } catch {
    /* không phải repo Git, bỏ qua */
  }
  if (!result) {
    try {
      result = statSync(file).mtime;
    } catch {
      result = null;
    }
  }
  dateCache.set(file, result);
  return result;
}

export function latestUpdate(notes: Note[]): Date | null {
  const dates = notes.map(lastUpdated).filter((d): d is Date => d !== null);
  if (!dates.length) return null;
  return new Date(Math.max(...dates.map((d) => d.getTime())));
}

export function formatDate(d: Date | null): string {
  if (!d) return '';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(d);
}
