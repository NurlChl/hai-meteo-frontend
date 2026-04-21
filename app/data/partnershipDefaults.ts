export interface PartnershipImage {
  url: string
  alt: string
}

export interface PartnershipBenefitItem {
  title: string
  description: string
  icon: string
}

export interface PartnershipSectionOneContent {
  title: string
  description: string
  image: PartnershipImage
  backgroundImage: PartnershipImage
  ctaText: string
  ctaHref: string
}

export interface PartnershipSectionTwoContent {
  title: string
  description: string
  items: PartnershipBenefitItem[]
}

export interface PartnershipSectionThreeContent {
  title: string
  description: string
  video?: string
  submitText: string
}

export interface PartnershipSectionsData {
  sectionOne: PartnershipSectionOneContent
  sectionTwo: PartnershipSectionTwoContent
  sectionThree: PartnershipSectionThreeContent
}

export const partnershipSectionKeys = {
  sectionOne: 'partnership-section-one',
  sectionTwo: 'partnership-section-two',
  sectionThree: 'partnership-section-three',
} as const

export const partnershipDefaults: PartnershipSectionsData = {
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
    ctaText: '',
    ctaHref: '',
  },
  sectionTwo: {
    title: '',
    description: '',
    items: [],
  },
  sectionThree: {
    title: '',
    description: '',
    video: '',
    submitText: '',
  },
}
