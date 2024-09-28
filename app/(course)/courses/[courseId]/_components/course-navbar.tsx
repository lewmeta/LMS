import { NavbarRoutes } from "@/components/navbar-routes"
import { CourseMobileSidebar } from "./course-mobile-sidebar"
import { Chapter, Course, UserProgress } from "@prisma/client"
import { SafeProfile } from "@/types";

interface CourseNavbarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null;
        })[]
    };
    progressCount: number;
    currentProfile?: SafeProfile | null;
}

export const CourseNavbar = ({
    course,
    progressCount,
    currentProfile
}: CourseNavbarProps) => {
    return (
        <div className="p-4 border h-full flex items-center shadow-sm">
            <CourseMobileSidebar
                course={course}
                progressCount={progressCount}
            />
            <NavbarRoutes />
        </div>
    )
}
