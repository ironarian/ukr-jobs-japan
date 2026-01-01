import { jobs } from "@/data/jobs";
import JobsClient from "./JobsClient";

export default function JobsPage() {
  return <JobsClient jobs={jobs} />;
}