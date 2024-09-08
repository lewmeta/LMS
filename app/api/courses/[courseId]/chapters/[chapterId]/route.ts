import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

import db from "@/lib/db";

const { Video } = new Mux(
    process.env.MUX_TOKEN_ID!,
    process.env.MUX_TOKEN_SECRET!,
);

export async function PATCH(req: Request, { params }: { params: { chapterId: string, courseId: string } }) {
    try {
        const { userId } = auth();
        const { isPublished, ...values } = await req.json(); // extracted isPublished so that we dont accidentally set isPublished to true.

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                ...values,
            }
        });

        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId
                }
            });

            if (existingMuxData) {
                try {
                    await Video.Assets.del(existingMuxData.assetId)
                } catch (error) {
                    console.log("[Mux Asset Delete]", error);
                }
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                });
            }

            try {
                const asset = await Video.Assets.create({
                    input: values.videoUrl,
                    playback_policy: "public",
                    test: false,
                })
                if (asset) {
                    await db.muxData.create({
                        data: {
                            chapterId: params.chapterId,
                            assetId: asset.id,
                            playbackId: asset.playback_ids?.[0]?.id,
                        }
                    })
                }
            } catch (error) {
                console.log("[Mux Asset Create]", error);
            }
        }

        return NextResponse.json(chapter);

    } catch (error) {
        console.log("[COURSES_CHAPTER_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(res: NextResponse, { params }: { params: { chapterId: string, courseId: string } }) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            }
        });
        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            }
        });

        if (!chapter) {
            return new NextResponse("Chapter Not Found", { status: 404 });
        }

        if (chapter.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId,
                }
            });

            if (existingMuxData) {
                await Video.Assets.del(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    }
                });
            }
        }

        const deletedChapter = await db.chapter.delete({
            where: {
                id: params.chapterId,
            }
        });

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: params.chapterId,
                isPublished: true,
            }
        })

        if (!publishedChaptersInCourse.length) {
            await db.course.update({
                where: {
                    id: params.courseId,
                },
                data: {
                    isPublished: false
                }
            })
        }

        return NextResponse.json(deletedChapter);
    } catch (error) {
        console.log("[CHAPTER_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}