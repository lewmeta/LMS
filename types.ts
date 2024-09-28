import { Category } from "@prisma/client"

export type CourseWithProgressWithCategory = {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
}

