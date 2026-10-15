// Chapter list and campus logos. Source of truth: the "Active Chapters" doc from the SOS board.
export const legacyChapters = [
  ["Arizona State", "Tempe, Arizona"], ["Benedictine", "Lisle, Illinois"], ["Brown", "Providence, Rhode Island"], ["Butler", "Indianapolis, Indiana"],
  ["UC Berkeley", "Berkeley, California"], ["UCLA", "Los Angeles, California"],
  ["UC Riverside", "Riverside, California"], ["UCF", "Orlando, Florida"], ["Colorado Boulder", "Boulder, Colorado"],
  ["Columbia", "New York, New York"], ["DePaul", "Chicago, Illinois"], ["Eastern Michigan", "Ypsilanti, Michigan"],
  ["Florida State", "Tallahassee, Florida"], ["University of Florida", "Gainesville, Florida"], ["UIC", "Chicago, Illinois"],
  ["Illinois State", "Normal, Illinois"], ["Indiana University Indianapolis", "Indianapolis, Indiana"], ["Loyola Chicago", "Chicago, Illinois"],
  ["Michigan", "Ann Arbor, Michigan"], ["Michigan State", "East Lansing, Michigan"], ["North Carolina", "Chapel Hill, North Carolina"], ["Oakland", "Rochester, Michigan"],
  ["UPenn", "Philadelphia, Pennsylvania"], ["USC", "Los Angeles, California"],
  ["South Florida", "Tampa, Florida"], ["Toledo", "Toledo, Ohio"], ["Washington", "Seattle, Washington"], ["Wayne State", "Detroit, Michigan"],
  ["Wellesley", "Wellesley, Massachusetts"], ["Wesleyan", "Middletown, Connecticut"], ["West Virginia", "Morgantown, West Virginia"], ["Yale", "New Haven, Connecticut"],
] as const;

export const collegeLogos: Record<string,string> = {
  "Arizona State":"/college-logos/arizona-state.png", "Benedictine":"/college-logos/benedictine.jpg", "Brown":"/college-logos/brown.jpg", "Butler":"/college-logos/butler.png",
  "UC Berkeley":"/college-logos/uc-berkeley.jpg", "UCLA":"/college-logos/ucla.jpg", "UC Riverside":"/college-logos/uc-riverside.jpg", "UCF":"/college-logos/ucf.jpg",
  "Colorado Boulder":"/college-logos/colorado-boulder.jpg", "Columbia":"/college-logos/columbia.jpeg", "DePaul":"/college-logos/depaul.jpg", "Eastern Michigan":"/college-logos/eastern-michigan.jpg",
  "Florida State":"/college-logos/florida-state.jpg", "University of Florida":"/college-logos/university-of-florida.jpeg", "UIC":"/college-logos/uic.jpg", "Illinois State":"/college-logos/illinois-state.png",
  "Indiana University Indianapolis":"/college-logos/indiana-university-indianapolis.jpg", "Loyola Chicago":"/college-logos/loyola-chicago.jpg", "Michigan":"/college-logos/michigan.jpg", "Michigan State":"/college-logos/michigan-state.png",
  "North Carolina":"/college-logos/north-carolina.png", "Oakland":"/college-logos/oakland.jpeg", "UPenn":"/college-logos/upenn.jpg", "USC":"/college-logos/usc.png",
  "South Florida":"/college-logos/south-florida.jpg", "Toledo":"/college-logos/toledo.jpg", "Washington":"/college-logos/washington.png", "Wayne State":"/college-logos/wayne-state.jpg",
  "Wellesley":"/college-logos/wellesley.jpg", "Wesleyan":"/college-logos/wesleyan.jpg", "West Virginia":"/college-logos/west-virginia.jpg", "Yale":"/college-logos/yale.jpg"
};
