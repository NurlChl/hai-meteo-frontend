export interface FeaturesImage {
  url: string
  alt: string
}

export interface FeaturesItem {
  id: string
  title: string
  description: string
  icon: string
  image?: string
  secondaryImage?: string
  video?: string
}

export interface FeaturesSectionOneContent {
  title: string
  description: string
  backgroundImage?: FeaturesImage
  video?: string
}

export interface FeaturesSectionTwoContent {
  title: string
  items: FeaturesItem[]
}

export interface FeaturesSectionThreeContent {
  title: string
  topFeatures: FeaturesItem[]
  bottomFeatures: FeaturesItem[]
}

export interface FeaturesSectionFourContent {
  title: string
  dashboardFeatures: FeaturesItem[]
}

export interface FeaturesSectionsData {
  sectionOne: FeaturesSectionOneContent
  sectionTwo: FeaturesSectionTwoContent
  sectionThree: FeaturesSectionThreeContent
  sectionFour: FeaturesSectionFourContent
}

export const featuresSectionKeys = {
  sectionOne: 'features-section-one',
  sectionTwo: 'features-section-two',
  sectionThree: 'features-section-three',
  sectionFour: 'features-section-four',
} as const

export const featuresDefaults: FeaturesSectionsData = {
  sectionOne: {
    title: '',
    description: '',
  },
  sectionTwo: {
    title: '',
    items: [],
  },
  sectionThree: {
    title: '',
    topFeatures: [],
    bottomFeatures: [],
  },
  sectionFour: {
    title: '',
    dashboardFeatures: [],
  },
}
