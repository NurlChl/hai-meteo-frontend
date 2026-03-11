export interface BlogImage {
  url: string
  alt: string
}

export interface BlogPost {
  id: number
  title: string
  description: string
  author: string
  date: string
  image: BlogImage
  category?: string
  featured?: boolean
}

export interface BlogSectionOneContent {
  title: string
  description: string
  backgroundImage?: BlogImage
}

export interface BlogSectionTwoContent {
  title: string
  description: string
  featuredPosts: BlogPost[]
}

export interface BlogSectionThreeContent {
  title: string
  description: string
  categories: string[]
}

export interface BlogSectionsData {
  sectionOne: BlogSectionOneContent
  sectionTwo: BlogSectionTwoContent
  sectionThree: BlogSectionThreeContent
}

export const blogSectionKeys = {
  sectionOne: 'blog-section-one',
  sectionTwo: 'blog-section-two',
  sectionThree: 'blog-section-three',
} as const

export const blogDefaults: BlogSectionsData = {
  sectionOne: {
    title: 'The HAI-Meteo Blog',
    description: 'The latest articles, news, blogs and learnings from HAI-Meteo',
    backgroundImage: {
      url: '/images/blog/BackgroundSectionOne.png',
      alt: 'Blog Background',
    },
  },
  sectionTwo: {
    title: 'Featured',
    description: '',
    featuredPosts: [
      {
        id: 1,
        image: {
          url: '/images/blog/featured-1.jpg',
          alt: 'Featured Post 1',
        },
        author: 'Amanda Rozi Kurnia',
        date: 'October 15, 2025',
        title: 'The Future of Weather Intelligence: How AI Chatbots Will Replace Traditional Forecast Searches',
        description: 'Discuss how GenAI + RAG allows users to ask natural questions and instantly receive explanations. Explain the advantage of contextual reasoning over static forecast apps.',
        featured: true,
      },
      {
        id: 2,
        image: {
          url: '/images/blog/featured-2.jpg',
          alt: 'Featured Post 2',
        },
        author: 'Giri Shaffaat Al Muttaqin',
        date: 'October 15, 2025',
        title: 'How Accurate Weather Insights Reduce Operational Costs in Large Organizations',
        description: 'Provide real examples cargo rerouting, workforce scheduling, supply chain decisions, energy usage optimization. All tied to accurate weather data.',
        featured: true,
      },
    ],
  },
  sectionThree: {
    title: '',
    description: '',
    categories: ['All', 'Technologies', 'Weather Forecast', 'Artificial Intelligence', 'News'],
  },
}
