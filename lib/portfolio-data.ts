// Mock portfolio data store — in-memory, persists for the lifetime of the dev server process.
// The admin panel reads/writes via /api/portfolio.

export interface HeroData {
  name: string;
  title: string;
  subtitle: string;
  tagline: string;
}

export interface AboutData {
  bio: string;
  skills: string[];
  email: string;
  location: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  year: string;
  url?: string;
  imageUrl?: string;
}

export interface Place {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  year: string;
  note?: string;
}

export interface TimelineEntry {
  id: string;
  year: string;
  title: string;
  company: string;
  description: string;
  type: "work" | "education" | "project";
}

export interface PortfolioData {
  hero: HeroData;
  about: AboutData;
  works: Project[];
  places: Place[];
  timeline: TimelineEntry[];
}

// In-memory store — mutated by POST /api/portfolio
let portfolioData: PortfolioData = {
  hero: {
    name: "Asheem",
    title: "Food & Travel Vlogger",
    subtitle: "& Content Creator",
    tagline:
      "Capturing the world one bite and one frame at a time — from street food stalls to mountain peaks, every story deserves to be told.",
  },
  about: {
    bio: "Hey, I'm Asheem — a food and travel vlogger based in Mumbai with a camera in one hand and a plate of street food in the other. I started vlogging in 2019 with a simple goal: to document the incredible flavours, faces, and landscapes that make this world so endlessly fascinating. What began as a personal diary quickly grew into a community of over a million people who share the same hunger for authentic experiences.\n\nFrom the smoky lanes of Varanasi's chaat stalls to the night markets of Bangkok and the ramen alleys of Tokyo, I chase stories that most travel guides miss. Every video is a love letter to a place — its food, its people, and the raw, unfiltered moments in between. When I'm not filming, I'm scouting the next hidden gem or editing the next adventure.",
    skills: [
      "Sony A7IV",
      "DJI Osmo",
      "Final Cut Pro",
      "Adobe Premiere",
      "Lightroom",
      "CapCut",
      "YouTube",
      "Instagram",
      "Food Photography",
      "Travel Vlogging",
      "Storytelling",
      "Drone Footage",
    ],
    email: "hello@asheem.vlogs",
    location: "Mumbai, India",
  },
  works: [
    {
      id: "w1",
      title: "Street Food Diaries",
      description:
        "A deep-dive series into India's most iconic street food scenes — from Mumbai's vada pav carts to Delhi's paranthe wali gali. Each episode follows a single dish from its origins to the vendor who perfected it over generations.",
      tags: ["Food", "Street", "Mumbai"],
      year: "2024",
      url: "",
      imageUrl: "",
    },
    {
      id: "w2",
      title: "Himalayan Trails",
      description:
        "A 12-episode trekking and food series across Himachal Pradesh, Uttarakhand, and Nepal. Documenting high-altitude cuisine, local homestays, and the breathtaking landscapes of the Himalayas in cinematic 4K.",
      tags: ["Travel", "Himalaya", "4K"],
      year: "2024",
      url: "",
      imageUrl: "",
    },
    {
      id: "w3",
      title: "City Bites",
      description:
        "A city-by-city food guide series covering the best hidden restaurants, street stalls, and local favourites across India's metros. No tourist traps — only the spots locals actually eat at.",
      tags: ["Food", "City Guide", "India"],
      year: "2023",
      url: "",
      imageUrl: "",
    },
    {
      id: "w4",
      title: "Monsoon Escapes",
      description:
        "A seasonal travel series celebrating India's monsoon — the waterfalls, the misty ghats, the petrichor, and the comfort food that comes alive when the rains hit. Shot entirely during the June–September season.",
      tags: ["Travel", "Monsoon", "Seasonal"],
      year: "2023",
      url: "",
      imageUrl: "",
    },
    {
      id: "w5",
      title: "Night Market Chronicles",
      description:
        "An Asia-wide series exploring the best night markets from Bangkok's Chatuchak to Taipei's Shilin and Singapore's Maxwell. Late-night street food, neon lights, and the electric energy of Asia after dark.",
      tags: ["Asia", "Night Market", "Street Food"],
      year: "2022",
      url: "",
      imageUrl: "",
    },
    {
      id: "w6",
      title: "Coastal Flavors",
      description:
        "A coastal India series tracing the seafood trail from Goa's beach shacks to Kerala's backwater villages and the fishing harbours of Tamil Nadu. Fresh catch, ancient recipes, and the people who keep them alive.",
      tags: ["Coastal", "Seafood", "India"],
      year: "2022",
      url: "",
      imageUrl: "",
    },
  ],
  places: [
    {
      id: "p1",
      name: "Mumbai",
      country: "India",
      lat: 19.076,
      lng: 72.8777,
      year: "2019",
      note:
        "Home base and the city that started it all. Filmed the first Street Food Diaries episode here — vada pav at Ashok Vada Pav, bhel puri at Juhu Beach, and the legendary Bademiya kebabs at midnight.",
    },
    {
      id: "p2",
      name: "Delhi",
      country: "India",
      lat: 28.6139,
      lng: 77.209,
      year: "2020",
      note:
        "Old Delhi's Chandni Chowk is a filmmaker's dream — the chaos, the colour, the smell of jalebis frying at dawn. Shot the City Bites Delhi episode over five days of non-stop eating.",
    },
    {
      id: "p3",
      name: "Goa",
      country: "India",
      lat: 15.2993,
      lng: 74.124,
      year: "2021",
      note:
        "Coastal Flavors started here. Spent two weeks with local fishermen, ate the freshest prawn curry of my life, and filmed the most beautiful sunset I've ever seen from a beach shack in Palolem.",
    },
    {
      id: "p4",
      name: "Manali",
      country: "India",
      lat: 32.2396,
      lng: 77.1887,
      year: "2022",
      note:
        "The starting point of the Himalayan Trails series. Trekked to Hampta Pass, ate thukpa in a tiny dhaba at 3,500m, and filmed the Milky Way from a campsite above the treeline.",
    },
    {
      id: "p5",
      name: "Varanasi",
      country: "India",
      lat: 25.3176,
      lng: 82.9739,
      year: "2022",
      note:
        "The most spiritually intense filming experience of my life. The ghats at dawn, the lassi shops, the kachori sabzi — Varanasi is a city that demands you slow down and pay attention.",
    },
    {
      id: "p6",
      name: "Bangkok",
      country: "Thailand",
      lat: 13.7563,
      lng: 100.5018,
      year: "2022",
      note:
        "Night Market Chronicles episode one. Chatuchak on a Sunday, pad kra pao at Or Tor Kor market, and the best mango sticky rice I've ever eaten from a cart on Sukhumvit.",
    },
    {
      id: "p7",
      name: "Bali",
      country: "Indonesia",
      lat: -8.3405,
      lng: 115.092,
      year: "2023",
      note:
        "Filmed a three-part series on Balinese food culture — babi guling in Ubud, jimbaran seafood at sunset, and a morning spent with a family making traditional offerings and ceremonial food.",
    },
    {
      id: "p8",
      name: "Tokyo",
      country: "Japan",
      lat: 35.6762,
      lng: 139.6503,
      year: "2023",
      note:
        "The ramen episode that broke 2M views. Spent a week eating through Shinjuku, Shibuya, and Tsukiji market. Japanese food culture is the most meticulous and beautiful I've ever encountered.",
    },
    {
      id: "p9",
      name: "Singapore",
      country: "Singapore",
      lat: 1.3521,
      lng: 103.8198,
      year: "2023",
      note:
        "Maxwell Food Centre, Lau Pa Sat, and the hawker stalls of Chinatown — Singapore is the world's greatest food city in the smallest footprint. Filmed the Night Market Chronicles finale here.",
    },
    {
      id: "p10",
      name: "Kathmandu",
      country: "Nepal",
      lat: 27.7172,
      lng: 85.324,
      year: "2024",
      note:
        "The Himalayan Trails series finale. Explored Thamel's food scene, ate momo at a tiny spot near Boudhanath, and filmed the Himalayas from Nagarkot at sunrise — the most cinematic shot of my career.",
    },
  ],
  timeline: [
    {
      id: "t1",
      year: "2024",
      title: "International Collabs & Own Merch",
      company: "Asheem Vlogs",
      description:
        "Launched the Asheem Vlogs merchandise line — travel pouches, camera straps, and a limited-edition food journal. Collaborated with vloggers in Japan, Indonesia, and Thailand on cross-channel series. Crossed 1.5M subscribers and was featured in Forbes India's 30 Under 30 Creator list.",
      type: "project",
    },
    {
      id: "t2",
      year: "2023",
      title: "1 Million Subscribers",
      company: "YouTube",
      description:
        "Hit the 1 million subscriber milestone in March 2023 — a moment I still can't believe. The Tokyo ramen video was the one that pushed us over the line. Celebrated by flying to Kathmandu and filming the Himalayan Trails finale.",
      type: "work",
    },
    {
      id: "t3",
      year: "2022",
      title: "First Major Brand Deals",
      company: "Sony India & DJI",
      description:
        "Signed long-term creator partnerships with Sony India (A7IV ambassador) and DJI (Osmo Pocket series). Also partnered with Airbnb India for a 6-episode travel series and MakeMyTrip for destination content. Revenue from brand deals allowed me to go full-time.",
      type: "work",
    },
    {
      id: "t4",
      year: "2021",
      title: "100K Subscribers & Going Full-Time",
      company: "Asheem Vlogs",
      description:
        "Crossed 100,000 subscribers in January 2021 and made the leap to full-time content creation. Quit my day job, invested in a Sony A7III and a DJI Mavic drone, and committed to uploading every week. The Coastal Flavors series was the turning point.",
      type: "project",
    },
    {
      id: "t5",
      year: "2020",
      title: "Channel Growth & First Viral Video",
      company: "YouTube",
      description:
        "The 'Best Street Food in Mumbai Under ₹50' video hit 500K views in a week and changed everything. Grew from 2,000 to 80,000 subscribers in six months. Started getting recognised at food stalls — the most surreal experience of my life.",
      type: "work",
    },
    {
      id: "t6",
      year: "2019",
      title: "Started the Channel",
      company: "Asheem Vlogs",
      description:
        "Uploaded the first video on a whim — a shaky, badly-lit tour of my favourite vada pav stall in Dadar. Shot on a phone, edited in iMovie, zero subscribers. But something about sharing that story felt right. Kept going.",
      type: "education",
    },
  ],
};

export function getPortfolioData(): PortfolioData {
  return portfolioData;
}

export function updatePortfolioSection<K extends keyof PortfolioData>(
  section: K,
  data: PortfolioData[K]
): PortfolioData {
  portfolioData = { ...portfolioData, [section]: data };
  return portfolioData;
}
