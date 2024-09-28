import db from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const CoursesPage = async () => {

    const userId = auth();

    if (!userId) {
        return redirect('/')
    }

    const { getToken, ...userIdWithoutToken } = userId;
    const courses = await db.course.findMany({
        where: {
            userId: userIdWithoutToken.userId!,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="p-6">
            <DataTable
                columns={columns}
                data={courses}
            />
        </div>
    )
}

export default CoursesPage;