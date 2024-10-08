import { CourseWithProgressWithCategory } from "@/types"
import { CourseCard } from "./course-card"

interface CoursesListProps {
    items: CourseWithProgressWithCategory[];
}

export const CourseList = ({
    items
}: CoursesListProps) => {
    return (
        <div>
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                {items.map((item) => (
                    <CourseCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        imageUrl={item.imageUrl!}
                        chaptersLength={item.chapters.length}
                        price={item.price!}
                        progress={item.progress!}
                        category={item.category?.name!}
                    />
                ))}
            </div>
        </div>
    )
}
