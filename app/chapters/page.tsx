import type { Metadata } from "next";
import { PageHero, Shell } from "../Interior";
import { activeChapters, pastChapters } from "../chapter-data";
import { ChapterDirectory } from "./ChapterDirectory";

export const metadata: Metadata = {
  title: "Chapters | Students Organize For Syria",
  description: `Find one of ${activeChapters.length} active Students Organize For Syria campus chapters, revive one of ${pastChapters.length} past chapters, or start a chapter at your school.`,
};

export default function Chapters(){return <Shell active="chapters"><PageHero index="04" kicker="Chapters" tone="green" title={<>Find your people.<br /><i>Build where you are.</i></>} intro="Every chapter starts with students who refuse to stay on the sidelines. Find an active chapter near you, revive a past one, or begin organizing at your campus."/><ChapterDirectory/></Shell>}
