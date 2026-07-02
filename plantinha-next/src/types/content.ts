export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface ContentEntryType {
  id: string;
  moduleId: string;
  title: string;
  slug: string;
  summary?: string;
  body?: string;
  coverImageUrl?: string;
  eventDate?: string;
  status: ContentStatus;
  order: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}
