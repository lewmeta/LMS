"use client"

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import qs from "query-string"

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

export const SearchInput = () => {

    const [value, setValue] = useState("");

    const debouncedValue = useDebounce(value, 500);

    const searchParams = new URLSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currentCategoryId = searchParams.get("categoryId");

    useEffect(() => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                title: debouncedValue,
                categoryId: currentCategoryId
            }
        }, { skipNull: true, skipEmptyString: true });
        router.push(url)
    }, [debouncedValue, currentCategoryId, router, pathname]);

    return (
        <div className="relative">
            <Search
                className="h-4 w-4 top-3 absolute left-3 text-slate-600 dark:text-slate-200 "
            />
            <Input
                className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 dark:bg-slate-800 focus-visible:ring-slate-200"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search for courses"
            />
        </div>
    )
}
