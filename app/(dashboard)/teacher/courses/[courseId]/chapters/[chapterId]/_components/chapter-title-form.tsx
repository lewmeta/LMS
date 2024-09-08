"use client";

import * as z from "zod";
import axios, { isAxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChapterTitleProps {
    initialData: {
        title: string;
    },
    courseId: string;
    chapterId: string;
};

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required."
    }),
});

export const ChapterTitleForm = ({
    chapterId,
    courseId,
    initialData
}: ChapterTitleProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const router = useRouter();

    const toggleEdit = () => {
        setIsEditing((current) => !current);
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Chapter title upated");
            toggleEdit();
            router.refresh();
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.message || "Something went wrong!")
            }
        }
    }
    return (
        <div className="mt-6 bg-slate-100 rounded-md p-4 dark:bg-gray-800">
            <div className="font-medium flex items-center justify-between">
                Course Title
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit title
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className="text-sm mt-2 dark:text-gray-300">
                    {initialData?.title}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4 dark:text-gray-300"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Advanced web development'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}