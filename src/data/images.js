// Centralized image paths for the BuildCo portfolio website.
// These URLs point to high-quality, real-world construction photography from Unsplash.
// To swap with client-provided photos, place them in public/images/ and change the paths here.

export const images = {
  // Hero section background
  heroBg: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80", 
  // Gritty industrial look: welder at work, steel beams

  // Before/After interactive slider (Signature Moment)
  beforeAfter: {
    before: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80",
    // Raw excavation site, heavy machinery, dirt, work-in-progress
    after: "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&w=1200&q=80",
    // Completed modern industrial concrete/steel facility
    beforeLabel: "Foundation & Grading (Before)",
    afterLabel: "Completed Operations Center (After)"
  },

  // Services section photos
  services: {
    residential: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    // Custom residential framing under blue sky
    commercial: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    // High-rise commercial steel and glass building
    renovation: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
    // Exposed steel columns/beams in renovation project
    interior: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=80"
    // Drywall studs and metal tracking on commercial site
  },

  // Portfolio/Gallery items with category and details
  gallery: [
    {
      id: "project-1",
      title: "Logistics Center Steel Frame",
      category: "commercial",
      src: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80",
      description: "Erection of 12,000 sq ft industrial steel warehouse frame, completed 3 weeks ahead of schedule.",
      location: "Madurai Outer Ring"
    },
    {
      id: "project-2",
      title: "Hillside Custom Villa",
      category: "residential",
      src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      description: "Structural concrete framing and load-bearing columns for a modern multi-level residential build.",
      location: "Kodaikanal Foothills"
    },
    {
      id: "project-3",
      title: "Highway Bypass Excavation",
      category: "commercial",
      src: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
      description: "Mass excavation, site grading, and structural soil stabilization for a logistics corridor.",
      location: "Trichy Highway"
    },
    {
      id: "project-4",
      title: "Heritage Building Retrofit",
      category: "renovation",
      src: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
      description: "Underpinning failing load-bearing brick walls and replacing damaged wood structures with steel I-beams.",
      location: "East Avani Street"
    },
    {
      id: "project-5",
      title: "Industrial Kitchen Fit-out",
      category: "interior",
      src: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=80",
      description: "Heavy-duty commercial drywall partitions and epoxy flooring application for food processing space.",
      location: "SIPCOT Industrial Park"
    },
    {
      id: "project-6",
      title: "Structural Slab Pour",
      category: "residential",
      src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      description: "Pouring 4000 PSI fiber-reinforced concrete slab for a multi-family housing development.",
      location: "Anna Nagar"
    }
  ],

  // Testimonial Author profile avatar
  testimonialAuthor: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80"
  // Professional engineer profile photo
};
