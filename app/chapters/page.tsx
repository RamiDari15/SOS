import { PageHero, Shell } from "../Interior";
import { ChapterDirectory } from "./ChapterDirectory";
export default function Chapters(){return <Shell active="chapters"><PageHero index="04" kicker="Chapters" tone="green" title={<>Find your people.<br /><i>Build where you are.</i></>} intro="Every chapter starts with students who refuse to stay on the sidelines. Find an active chapter near you, revive a past one, or begin organizing at your campus."/><ChapterDirectory/></Shell>}
