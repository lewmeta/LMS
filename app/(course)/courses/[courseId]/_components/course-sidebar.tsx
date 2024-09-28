import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs"
import { Chapter, Course, UserProgress } from "@prisma/client"

import db from "@/lib/db"

import { CourseProgress } from "@/components/course-progress"
import { CourseSidebarItem } from "./course-sidebar-item"

interface CourseSidebarItemProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null;
        })[]
    };
    progressCount: number;
}

export const CourseSidebar = async ({
    course,
    progressCount
}: CourseSidebarItemProps) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const purchase = await db.purchase.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId: course.id
            }
        },
    });
    return (
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
            <div className="p-8 flex flex-col border-b">
                <h1 className="font-semibold">
                    {course.title}
                </h1>
                {purchase && (
                    <div className="mt-10">
                        <CourseProgress
                            value={progressCount}
                            variant="success"
                        />
                    </div>
                )}
            </div>
            <div className="flex flex-col w-full">
                {course.chapters.map((chapter) => (
                    <CourseSidebarItem
                        key={chapter.id}
                        id={chapter.id}
                        courseId={chapter.courseId}
                        isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                        isLocked={!chapter.isFree && !purchase}
                        label={chapter.title}
                    />
                ))}
            </div>
        </div>
    )
}
