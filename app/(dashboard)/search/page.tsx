import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import db from "@/lib/db"
import { getCourses } from "@/actions/get-courses";
import { SearchInput } from "@/components/search-input";
import { Categories } from "./_components/categories";
import { CourseList } from "@/components/course-list";

interface SearchPageProps {
    searchParams: {
        title: string;
        categoryId: string;
    };
};


const SearchPage = async ({
    searchParams,
}: SearchPageProps) => {
    const { userId } = auth();

    if (!userId) {
        redirect("/");
    }

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc",
        }
    });

    const courses = await getCourses({
        userId,
        ...searchParams,
    });

    return (
        <>
            <div className="px-6 pt-6 md:hidden md:mb-0 block">
                <SearchInput />
            </div>
            <div className="p-6 space-y-4">
                <Categories items={categories} />
                <CourseList items={courses} />
            </div>
        </>
    )
}

export default SearchPage