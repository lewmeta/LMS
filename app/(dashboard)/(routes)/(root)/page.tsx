import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation";
import { CheckCircle, Clock, InfoIcon } from "lucide-react";

import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CourseList } from "@/components/course-list";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-4">

      <div className="grid grid-cols-1 gap-4">
        Banner here
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2">
        Card goes here
      </div>
    </div>
  );
}
