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
  backgroundImage: PartnershipImage
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
    title: 'Elevate Your Solutions \nwith Enterprise-Grade \nWeather Intelligence.',
    description: 'A partnership with HAI-Meteo offers clear benefits for product development and market positioning.',
    image: {
      url: '/images/partnership/hero_phones.png',
      alt: 'Partnership Collaboration',
    },
    backgroundImage: {
      url: '/images/partnership/BackgroundSectionOne.png',
      alt: 'Partnership section background',
    },
    ctaText: 'Become a Partner',
    ctaHref: '#contact-form',
  },
  sectionTwo: {
    title: 'Benefits \nof HAI-Meteo Partners',
    description: 'Partnering with HAI-Meteo unlocks significant advantages for enhancing product development and elevating your market presence.',
    items: [
      {
        title: 'Enhance Product\nPortfolio Value',
        description: 'Integrate our specialized, location-specific predictive intelligence to enhance your existing services or accelerate the development of new, data-driven solutions.',
        icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
      },
      {
        title: 'Increase Customer Value\nProposition',
        description: 'Leverage our advanced forecasts to provide your clients with higher confidence and precision. This enhancement supports improved customer satisfaction and justifies competitive pricing structures.',
        icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      },
      {
        title: 'Establish Market\nDifferentiation',
        description: 'Gain a competitive edge by offering solutions powered by custom-tailored meteorological data. This strategic capability helps position your company uniquely in your sector.',
        icon: 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z',
      },
    ],
  },
  sectionThree: {
    title: 'Ready to \nCollaborate?',
    description: 'Fill out the quick form below, and our Partnership Team will contact you shortly to explore the possibilities.',
    backgroundImage: {
      url: '/images/partnership/contact_bg.png',
      alt: 'Earth Background',
    },
    submitText: 'Submit Request',
  },
}
