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
}

export interface FeaturesSectionOneContent {
  title: string
  description: string
  image?: FeaturesImage
  backgroundImage?: FeaturesImage
}

export interface FeaturesSectionTwoContent {
  title: string
  description: string
  items: FeaturesItem[]
}

export interface FeaturesSectionThreeContent {
  title: string
  description: string
  topFeatures: FeaturesItem[]
  bottomFeatures: FeaturesItem[]
}

export interface FeaturesSectionFourContent {
  title: string
  description: string
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
    title: 'All-in-One\nEnterprise-Grade Weather\nIntelligence Platform',
    description: 'HAI-Meteo is a next-gen weather platform for organizations needing accurate climate insights. Powered by AI and data fusion, it helps you plan and respond confidently across scales.',
    image: {
      url: '/images/technology/sectionone/SectionOne.png',
      alt: 'HAI-Meteo Features',
    },
    backgroundImage: {
      url: '/images/technology/sectionone/BackgroundSectionOne.png',
      alt: 'Background pattern',
    },
  },
  sectionTwo: {
    title: 'Core Capabilities',
    description: '',
    items: [
      {
        id: 'personalized-location',
        title: 'Personalized Location',
        description: 'Deliver highly localized forecasts tailored to the exact sites you manage. Every prediction is optimized for the unique weather behavior of your operational zones, ensuring accuracy where it matters most.',
        icon: 'target',
        image: '/images/features/Bg1.png',
      },
      {
        id: 'comprehensive-forecast',
        title: 'Comprehensive Forecast',
        description: 'Access complete weather intelligence from hourly and daily forecasts to extended long-range projections. Perfect for planning operations, scheduling workforces, and anticipating environmental risks ahead of time',
        icon: 'cloud-sun',
        image: '/images/features/Bg2.png',
      },
      {
        id: 'ai-powered-insight',
        title: 'AI-Powered Insight',
        description: 'HAI-Meteo uses cutting-edge AI models to generate precise rain alerts and deliver interactive insights through an integrated GenAI chatbot. Receive instant answers, interpret complex weather patterns, and make informed decisions faster.',
        icon: 'brain',
        image: '/images/features/Bg3.png',
      },
      {
        id: 'historical-trends',
        title: 'Historical Trends',
        description: 'Look back at past weather patterns for comparison or planning.',
        icon: 'history',
        image: '/images/features/Bg4.png',
      },
    ],
  },
  sectionThree: {
    title: 'Supporting Features',
    description: '',
    topFeatures: [
      {
        id: 'detail-prediction',
        title: 'Detail Prediction',
        description: 'Multi-location monitoring tool for real-time weather detail access.',
        icon: 'chart-bar',
      },
      {
        id: 'multi-year-historical',
        title: 'Multi-Year Historical Records',
        description: 'Get reliable weather answers from the Gen AI chatbot with forecasts and LLM expertise.',
        icon: 'clock',
      },
      {
        id: 'short-long-forecasts',
        title: 'Short to Long Term Forecasts',
        description: 'AI weather summary that responds to weather changes.',
        icon: 'calendar',
      },
    ],
    bottomFeatures: [
      {
        id: 'seasonal-intelligence',
        title: 'Seasonal Intelligence',
        description: 'This feature offers AI seasonal predictions, identifying rainy and dry seasons.',
        icon: 'sun',
      },
      {
        id: 'climate-extremes',
        title: 'Climate Extremes Summary',
        description: 'Quickly view the hottest, coldest, wettest, and windiest periods on record, ideal for climate analysis and risk assessment.',
        icon: 'shield-exclamation',
      },
    ],
  },
  sectionFour: {
    title: 'Interactive Dashboard',
    description: '',
    dashboardFeatures: [
      {
        id: 'visual-wind-motion',
        title: 'Visual\nWind Motion',
        description: 'Automatically classify and organize feedback across all your sources.',
        icon: 'wind',
      },
      {
        id: 'instant-site-insights',
        title: 'Instant\nSite Insights',
        description: 'Quickly ingest and structure data from diverse weather sensors and sources.',
        icon: 'lightning-bolt',
      },
      {
        id: 'drag-through-time',
        title: 'Drag through\ntime with a slider',
        description: 'Automatically categorize and structure data from various weather sensors and sources.',
        icon: 'adjustments',
      },
      {
        id: 'intuitive-charts',
        title: 'Intuitive\nCharts',
        description: 'Understand predictions through intuitive charts.',
        icon: 'chart-pie',
      },
      {
        id: 'long-term-trends',
        title: 'Long-Term\nTrens Analytics',
        description: 'See the bigger picture with long-term trend analytics.',
        icon: 'trending-up',
      },
    ],
  },
}
