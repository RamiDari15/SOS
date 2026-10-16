import Link from "next/link";
import { Arrow, PageHero, Shell } from "./Interior";

export default function NotFound() {
  return <Shell>
    <PageHero index="404" kicker="Page not found" title={<>This page<br /><i>isn’t here.</i></>} intro="The link may be old or mistyped. The chapter directory has every current and past Students Organize For Syria chapter."/>
    <section className="not-found-links">
      <Link className="pill pill-green" href="/">Go to the homepage <Arrow /></Link>
      <Link className="line-link" href="/chapters">Find a chapter <Arrow /></Link>
    </section>
  </Shell>;
}
