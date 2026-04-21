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
    title: '',
    description: '',
    image: {
      url: '',
      alt: '',
    },
    backgroundImage: {
      url: '',
      alt: '',
    },
  },
  sectionTwo: {
    title: '',
    description: '',
    image: {
      url: '',
      alt: '',
    },
    items: [],
  },
  sectionThree: {
    title: '',
    description: '',
    image: {
      url: '',
      alt: '',
    },
    items: [],
  },
  sectionFour: {
    title: '',
    description: '',
    image: {
      url: '',
      alt: '',
    },
  },
}
