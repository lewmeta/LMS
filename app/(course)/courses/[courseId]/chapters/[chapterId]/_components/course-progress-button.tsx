'use client'

import axios from "axios"
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { boolean } from "zod";

interface CourseProgressButtonProps {
    chapterId: string;
    couresId: string;
    isCompleted?: string;
    nextChapterId?: string;
}

export const CourseProgressButton = ({
    chapterId,
    couresId,
    isCompleted,
    nextChapterId,
}: CourseProgressButtonProps) => {
    const router = useRouter();
    const confetti = useConfettiStore();

    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true)

            await axios.put(`/api/courses/${couresId}/chapters/${chapterId}/progress`, {
                isCompleted: !isCompleted
            })

            if (!isCompleted && !nextChapterId) {
                confetti.onOpen();
            }

            if (!isCompleted && nextChapterId) {
                router.push(`/courses/${couresId}/chapters/${nextChapterId}`)
            }

            toast.success("Progress updated!")
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong!")
        } finally {
            setIsLoading(false)
        }
    }

    const Icon = isCompleted ? XCircle : CheckCircle;

    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            type="button"
            variant={isCompleted ? 'outline' : 'success'}
            className="w-full md:w-auto"
        >
            {isCompleted ? 'Not completed' : 'Mar as complete'}
        </Button>
    )
}
