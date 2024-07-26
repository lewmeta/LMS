"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ImageIcon, Pencil, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { Attachment, Course } from "@prisma/client"
import Image from "next/image"
import { FileUpload } from "@/components/file-upload"

interface AttachmentFormProps {
    initialData: Course & { attachments?: Attachment[] };
    courseId: string;
};

const formSchema = z.object({
    url: z.string().min(1),
});

export const AttachmentForm = ({
    initialData,
    courseId,
}: AttachmentFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const router = useRouter();

    const toggleEdit = () => setIsEditing((current) => !current);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values);
            toast.success("Course updated");
            router.refresh();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data || "something went wrong")
            }
        }
    }

    const onDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);

            toast.success("Attachment deleted");
            router.refresh();
        } catch (error) {
            toast.error("Somthing went wrong!");
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-gray-800 dark:text-slate-300">
            <div className="font-medium flex items-center justify-between">
                Course attachments
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a file
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                    {initialData.attachments?.length === 0 && (
                        <p className="text-sm mt-2 to-slate-500 italic">
                            No attachments yet
                        </p>
                    )}
                </>
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="courseAttatchments"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ url: url })
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Add anything your students might need to complete your course.
                    </div>
                </div>
            )}
        </div>
    )
}