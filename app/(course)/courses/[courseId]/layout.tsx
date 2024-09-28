import { getProgress } from "@/actions/get-progress";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { CourseNavbar } from "./_components/course-navbar";

const CourseLayout = async ({
    children,
    params,
}: { children: React.ReactNode, params: { courseId: string } }) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    // TODO: Add Safe profile;
    const safeProfile = {} as any;

    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
        },
        include: {
            chapters: {
                where: {
                    isPublished: true
                },
                include: {
                    userProgress: {
                        where: {
                            userId,
                        }
                    }
                },
                orderBy: {
                    position: "asc"
                }
            },
        },
    });

    if (!course) {
        return redirect("/");
    }

    //@ts-ignore
    const progressCount: number = await getProgress(userId, course.id);

    return (
        <div className="h-full">
            <div className="h-[80px] md:pl-80 fixed w-full inset-y-0 z-50">
                <CourseNavbar
                    course={course}
                    progressCount={progressCount}
                    currentProfile={[] as any}
                />
            </div>
            <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
                side
            </div>
            <main className="md:pl-80 pt-[80px] h-full">
                {children}
            </main>
        </div>
    )
}
export default CourseLayout;