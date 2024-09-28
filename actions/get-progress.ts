import db from "@/lib/db";

export const getProgress = async (
    userId: string,
    courseId: string,
): Promise<number | null> => {
    try {
        const publishedChapters = await db.chapter.findMany({
            where: {
                courseId,
                isPublished: true
            },
            select: {
                id: true
            },
        });

        // create an array of chapter IDs;
        const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

        const validCompletedChapters = await db.userProgress.count({
            where: {
                userId: userId,
                chapterId: {
                    in: publishedChapterIds,
                },
                isCompleted: true
            }
        })

        // calculate progress percentage

        const progressPercentage = (validCompletedChapters / publishedChapters.length) * 100;
        return progressPercentage;

    } catch (error) {
        console.log("[GET_PROGRESS]", error);
        return 0;
    }
}