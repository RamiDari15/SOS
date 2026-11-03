import type { Metadata } from "next";
import { Shell } from "../Interior";
import { activeChapters, pastChapters } from "../chapter-data";
import { ChapterDirectory } from "./ChapterDirectory";

export const metadata: Metadata = {
  title: "Chapters | Students Organize For Syria",
  description: `Find one of ${activeChapters.length} active Students Organize For Syria campus chapters, revive one of ${pastChapters.length} past chapters, or start a chapter at your school.`,
};

export default function Chapters(){return <Shell active="chapters"><ChapterDirectory/></Shell>}
