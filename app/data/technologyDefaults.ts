export interface TechnologyImage {
  url: string
  alt: string
}

export interface TechnologyItem {
  title: string
  description: string
  icon: string
  image?: TechnologyImage
}

export interface TechnologySectionContent {
  title: string
  description: string
  image: TechnologyImage
  backgroundImage?: TechnologyImage
  items?: TechnologyItem[]
}

export interface TechnologySectionsData {
  sectionOne: TechnologySectionContent
  sectionTwo: TechnologySectionContent
  sectionThree: TechnologySectionContent
  sectionFour: TechnologySectionContent
}

export const technologySectionKeys = {
  sectionOne: 'technology-section-one',
  sectionTwo: 'technology-section-two',
  sectionThree: 'technology-section-three',
  sectionFour: 'technology-section-four',
} as const

export const technologyDefaults: TechnologySectionsData = {
  sectionOne: {
    title: 'Discover the power\nof HAI-Meteo Technology.\nUnlock its potential today!',
    description:
      'HAI-Meteo is a cutting-edge weather platform for organizations needing precise climate insights. Using AI and data fusion, it helps you plan and respond confidently.',
    image: {
      url: '/images/technology/sectionone/SectionOne.png',
      alt: 'HAI-Meteo technology',
    },
    backgroundImage: {
      url: '/images/technology/sectionone/BackgroundSectionOne.png',
      alt: 'Background pattern',
    },
  },
  sectionTwo: {
    title: 'HAI-Meteo Model',
    description:
      'Our proprietary Machine Learning Weather Prediction (MLWP) system that revolutionizes enterprise forecasting through intelligent AI technology:',
    image: {
      url: '/images/technology/sectiontwo/sectiontwo.png',
      alt: 'Main page illustration',
    },
    items: [
      {
        title: 'Next-Generation\nAI Forecasting',
        icon: 'ai',
        description:
          'Powered by cutting-edge machine learning trained on millions of atmospheric data points, delivering predictions with unprecedented accuracy and speed.',
      },
      {
        title: 'Intelligent\nData Fusion',
        icon: 'fusion',
        description: 'Advanced capabilities leveraging our proprietary technology stack.',
      },
      {
        title: 'Tropical Weather\nExpertise',
        icon: 'weather',
        description: 'Advanced capabilities leveraging our proprietary technology stack.',
      },
      {
        title: 'Self-Improving\nIntelligence',
        icon: 'intelligence',
        description: 'Advanced capabilities leveraging our proprietary technology stack.',
      },
    ],
  },
  sectionThree: {
    title: 'Data Sources',
    description:
      'HAI-Meteo combines real-time observations with decades of historical records to power our intelligent forecasting system.',
    image: {
      url: '/images/technology/sectionthree/satellite.png',
      alt: 'Satellite',
    },
    items: [
      {
        title: 'Satellite & Ground Radar Imagery',
        description:
          'Real-time weather radar and satellite observations from national meteorological agencies for accurate local weather monitoring, along with AWS weather data (if available).',
        icon: 'satellite',
      },
      {
        title: 'Global Historical Weather Records',
        description:
          'Comprehensive historical climate data from international atmospheric research institutions for long-term pattern recognition and trend analysis.',
        icon: 'historical',
      },
      {
        title: 'High-Resolution Reanalysis Data',
        description:
          'Decades of detailed atmospheric conditions from leading global climate centers, providing foundational understanding of weather behaviors.',
        icon: 'reanalysis',
      },
    ],
  },
  sectionFour: {
    title: 'Intelligence in Action',
    description: 'How HAI-Meteo Transforms Data into Decisions',
    image: {
      url: '/images/technology/sectionfour/diagram.png',
      alt: 'HAI-Meteo Intelligence Process Diagram',
    },
  },
}
