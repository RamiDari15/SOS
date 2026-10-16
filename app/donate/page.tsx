import type { Metadata } from "next";
import { PageHero, Shell } from "../Interior";
import { givingSlots } from "../site-data";
import { DonatePanel } from "./DonatePanel";

export const metadata: Metadata = {
  title: "Donate | Students Organize For Syria",
  description: "Support students who organize, educate their campuses, advocate for Syria, and sustain a national community.",
};

export default function Donate(){return <Shell active="donate"><PageHero index="09" kicker="Support the movement" tone="green" title={<>Fuel student<br/><i>power.</i></>} intro="Your support can help students organize, educate their campuses, advocate for Syria, and sustain a national community."/><div className="palette-proof" aria-hidden="true"><i/><i/><i/><i/><i/></div><section className="donation-stage"><div className="donation-story"><p className="overline">Give today</p><h2>Back the people<br/>building what’s next.</h2><p>Every gift helps students organize on their campuses and stay connected as a national network. Email our team to give today; online checkout opens soon.</p><p className="donation-note"><b>Donation contact</b><br/><a href="mailto:sos@organize4syria.com?subject=Donation%20inquiry">sos@organize4syria.com</a></p></div><DonatePanel/></section><section className="giving-uses"><div className="giving-head"><p className="overline">Your support at work</p><h2>Where your<br/><i>money goes.</i></h2></div><div className="giving-grid">{givingSlots.map((slot,i)=><figure key={slot.title} data-reveal>{/* Real photos: add rights-cleared images to public/donate/ and set `image` on the slot in app/site-data.ts (givingSlots). */}{slot.image ? <img src={slot.image} alt={slot.alt ?? ""}/> : <div className="giving-placeholder" aria-hidden="true"><span>{String(i+1).padStart(2,"0")}</span><small>Photo coming soon</small></div>}<figcaption><span>{String(i+1).padStart(2,"0")}</span><h3>{slot.title}</h3><p>{slot.caption}</p></figcaption></figure>)}</div></section></Shell>}
