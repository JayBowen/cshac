// `stats` is real/derived (1867, 159 years as of 2026, Phoenix Park) and is fine to keep.
export const stats = [
  { n: "1867", l: "The year we were founded" },
  { n: "159", l: "Years, and counting" },
  { n: "Phoenix Park", l: "Home since day one" },
]

// Timeline for the History page. Sourced from the club's own history page
// (civilserviceharriers.ie/history-2). The `placeholder: true` entry is the
// club's own "to follow" gap for the mid-century decades, not invented content.
// TODO(launch): the club site lists the 1960s, 1980s and 1990s–2000s as "to follow" —
// fill in the mid-century entry once those records are gathered.
export const milestones = [
  {
    year: "1867",
    title: "The club is founded",
    body: "Civil Service Harriers is officially founded, with its first recorded meeting held at the Leinster Cricket Club in Rathmines. Membership is at first confined to civil servants, and later opened to all. It is the oldest athletic club in Ireland.",
  },
  {
    year: "1878",
    title: "The first Civil Service Sports",
    body: "The club holds its first sports meeting in May. It grows into one of the most popular athletics events in the country and stays a fixture of the Irish calendar right up to the 1960s.",
  },
  {
    year: "1880s",
    title: "A golden decade",
    body: "The club enjoys a run of real success behind star athletes John Purcell, Hugh Hart and Michael Hart, with long jump contested on the grass at College Park.",
  },
  {
    year: "1890–1925",
    title: "The lean years",
    body: "Through the long shadow of the Famine, mass emigration, the First World War, the 1916 Easter Rising, the War of Independence and the Civil War, the club struggles to keep going.",
  },
  {
    year: "1925",
    title: "Reformed by Duffy and Hutton",
    body: "Frank Duffy and Stephen Hutton reform the club and lead it back to its feet, steering it through the decades that follow.",
  },
  {
    year: "1960s–2000s",
    title: "Still being gathered",
    body: "The club's records through the middle decades — the later Civil Service Sports and the club across the 1960s, 80s, 90s and 2000s — are still being pulled together from the archive.",
    placeholder: true,
  },
  {
    year: "2010s",
    title: "Winning on the country",
    body: "A strong decade on the cross-country and road: Neil O'Rourke takes Dublin Intermediate Cross Country gold (2015), the women's over-35 team win team gold at the AAI National 10k and Anna Sadowska wins the National Masters Cross Country (2016), and Ashley Ryan claims Dublin Novice and Leinster Novice titles (2017).",
  },
  {
    year: "Today",
    title: "Still running, open to all",
    body: "More than a century and a half on, the club is still racing across country, road and track in the Phoenix Park — for members of every standard and age.",
  },
]

// Famous alumni, shown on the History page. Sourced from the club's own site
// (civilserviceharriers.ie/club-history/famous-athletes). `meta` is a short
// era/discipline label; `body` is the detail.
export const famousAthletes = [
  {
    name: "Bram Stoker",
    meta: "1870s",
    body: "The author of Dracula ran with the club in the 1870s, while working as a civil servant in Dublin.",
  },
  {
    name: "John Purcell",
    meta: "1880–1887 · Hop, step & jump",
    body: "One of Ireland's finest all-rounders of the era. A hop, step and jump specialist who also raced hurdles, sprints, long jump and steeplechase, he emigrated to the USA in 1888. From Barefield, Co. Clare.",
  },
  {
    name: "Frank Duffy",
    meta: "Coach",
    body: "The celebrated coach who guided two Harriers to the Olympics — Noel Carroll (1968) and Des McGann (1972). He famously ran 60 miles in the Phoenix Park to mark his 60th birthday.",
  },
  {
    name: "John Lawlor",
    meta: "Hammer · Olympian",
    body: "Threw the hammer at the 1960 Rome Olympics, finishing fourth, and again at the 1964 Tokyo Olympics.",
  },
  {
    name: "Paddy Lowry",
    meta: "Sprints · Olympian",
    body: "Ran the 100m and 200m for Ireland at the 1960 Rome Olympics.",
  },
  {
    name: "Noel Carroll",
    meta: "400m / 800m · Olympian",
    body: "A 1968 Mexico Olympian over 400m and 800m. He won 14 national titles through the 1960s and two European Indoor 800m titles, and later helped found the Dublin Marathon in 1980.",
  },
  {
    name: "Des McGann",
    meta: "Marathon · Olympian",
    body: "Ran the marathon for Ireland at the 1972 Munich Olympics.",
  },
  {
    name: "Declan Hegarty",
    meta: "Hammer · Olympian",
    body: "Threw the hammer at the 1984 Los Angeles Olympics.",
  },
  {
    name: "Kingston Mills",
    meta: "Marathon · Club record",
    body: "Raced the marathon at the 1987 Rome World Championships in a personal best of 2:13:55 — still a club record, as are his marks at 10 miles and the half marathon. His father, Frank Mills, ran international cross country for Ireland at Baldoyle in 1931–32.",
  },
  {
    name: "Gerry Healy",
    meta: "Marathon",
    body: "Came within a whisker of qualifying for the marathon at the 2000 Sydney Olympics.",
  },
]
