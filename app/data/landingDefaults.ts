export interface LandingImage {
  url: string
  alt: string
}

export interface LandingFeature {
  title: string
  description: string
  icon: string
}

export interface LandingSolution {
  id: string
  title: string
  description: string
  video?: string
}

export interface LandingTechnology {
  title: string
  description: string
  icon: string
}

export interface LandingNews {
  title: string
  date: string
  description: string
  image: LandingImage
}

export interface LandingFaq {
  question: string
  answer: string
}

export interface LandingSectionOneContent {
  title: string
  description: string
  backgroundImage?: LandingImage
  backgroundVideo?: string
  showcaseVideo?: string
}

export interface LandingSectionTwoContent {
  title: string
  description: string
  features: LandingFeature[]
}

export interface LandingSectionThreeContent {
  title: string
  description: string
  timelineMarkerImage?: LandingImage
  solutions: LandingSolution[]
}

export interface LandingSectionFourContent {
  title: string
  description: string
  animationFile?: string
  radarImage?: LandingImage
  logoImage?: LandingImage
  technologies: LandingTechnology[]
}

export interface LandingSectionFiveContent {
  title: string
  date: string
  description: string
  image: LandingImage
  link?: string
}

export interface LandingSectionSixContent {
  title: string
  description: string
  faqs: LandingFaq[]
}

export interface LandingSectionSevenContent {
  title: string
  description: string
  backgroundImage?: LandingImage
  lineImage?: LandingImage
  demoVideo?: string
}

export interface LandingSectionsData {
  sectionOne: LandingSectionOneContent
  sectionTwo: LandingSectionTwoContent
  sectionThree: LandingSectionThreeContent
  sectionFour: LandingSectionFourContent
  sectionFive: LandingSectionFiveContent
  sectionSix: LandingSectionSixContent
  sectionSeven: LandingSectionSevenContent
}

export const landingSectionKeys = {
  sectionOne: 'landing-section-one',
  sectionTwo: 'landing-section-two',
  sectionThree: 'landing-section-three',
  sectionFour: 'landing-section-four',
  sectionFive: 'landing-section-five',
  sectionSix: 'landing-section-six',
  sectionSeven: 'landing-section-seven',
} as const

export const landingSectionFourAnimationFile = '/video/Flow 6.json'

export const landingDefaults: LandingSectionsData = {
  sectionOne: {
    title: 'The Next Enterprise Grade \nAI Weather',
    description: 'Forecast the future with AI where intelligent insights meet effortless weather precision.',
  },
  sectionTwo: {
    title: 'Empowering the next generation of weather intelligence with AI.',
    description: 'Features',
    features: [
      {
        title: 'Personalized \nLocations',
        description: 'Get precise weather data for your exact location.',
        icon: '',
      },
      {
        title: 'Comprehensive \nForecast',
        description: 'Access complete weather intelligence from hourly and daily forecasts.',
        icon: '',
      },
      {
        title: 'AI-Powered \nInsight',
        description: 'Leverage artificial intelligence to uncover hidden patterns and trends.',
        icon: '',
      },
      {
        title: 'Historical \nTrends',
        description: 'Analyze historical weather data to understand long-term trends.',
        icon: '',
      },
    ],
  },
  sectionThree: {
    title: 'Weather data into \nactionable solutions',
    description: 'Solution in Action',
    solutions: [
      {
        id: 'mining',
        title: 'Mining Industry',
        description: 'Enhance on-site safety and operational efficiency with precise, risk-aware weather intelligence.',
      },
      {
        id: 'oil_gas',
        title: 'Oil & Gas',
        description: 'Strengthen asset protection and field operations with high-accuracy, real-time weather forecasting powered by AI.',
      },
      {
        id: 'agriculture',
        title: 'Agriculture',
        description: 'Optimize crop planning with AI-driven weather insights tailored for every planting and harvesting cycle.',
      },
    ],
  },
  sectionFour: {
    title: 'HAI-Meteo uses real-time data and history record for smart forecasts.',
    description: 'Technology',
    animationFile: landingSectionFourAnimationFile,
    technologies: [
      {
        title: 'Satellite & Ground Radar Imagery',
        description: 'Real-time weather radar and satellite observations from national meteorological, and with AWS weather data',
        icon: 'Signal',
      },
      {
        title: 'Global Historical Weather Records',
        description: 'Historical climate data from global research institutions.',
        icon: 'Database',
      },
      {
        title: 'High-Resolution Reanalysis Data',
        description: 'Decades of detailed atmospheric conditions from leading global climate centers',
        icon: 'BarChart3',
      },
    ],
  },
  sectionFive: {
    title: 'AI chatbots will replace traditional weather forecasts.',
    date: 'October 15, 2025',
    description: 'Discuss how GenAI + RAG allows users to ask natural questions and instantly receive explanations. Explain the advantage of contextual reasoning over static forecasts.',
    image: {
      url: '',
      alt: '',
    },
    link: '/blog',
  },
  sectionSix: {
    title: 'Frequently asked questions',
    description: 'Questions? Connect with sales for support and see how HAI-Meteo can transform your forecasting!',
    faqs: [
      {
        question: 'How does HAI-Meteo differ from standard global weather applications?',
        answer: 'HAI-Meteo leverages advanced AI models combined with high-resolution local data to deliver hyper-accurate, location-specific forecasts. Unlike standard global apps that rely on coarse resolution models, our platform integrates satellite imagery, ground radar, and historical climate data for superior prediction accuracy.',
      },
      {
        question: 'What technology drives your weather predictions?',
        answer: 'Our predictions are powered by a combination of machine learning algorithms, including deep neural networks trained on decades of atmospheric data, real-time satellite and radar feeds, and proprietary AI models that continuously learn and adapt to local weather patterns.',
      },
      {
        question: 'How far in advance can HAI-Meteo predict weather conditions?',
        answer: 'HAI-Meteo provides reliable forecasts up to 14 days in advance, with hourly precision for the first 72 hours. Our AI models are continuously refined to extend forecast accuracy even further while maintaining high confidence levels.',
      },
      {
        question: 'Can I monitor multiple operational sites simultaneously?',
        answer: 'Yes, HAI-Meteo supports multi-site monitoring through a unified dashboard. You can configure custom alerts and thresholds for each location, enabling centralized weather risk management across all your operational areas.',
      },
      {
        question: 'How does the "Prediction Highlight" feature help mitigate risk?',
        answer: 'The Prediction Highlight feature identifies and flags significant weather events before they occur, providing early warnings with actionable insights. This allows teams to proactively adjust operations, schedule preventive measures, and minimize weather-related disruptions.',
      },
      {
        question: 'Do you provide historical data for climate analysis?',
        answer: 'Absolutely. HAI-Meteo offers comprehensive historical weather datasets spanning multiple decades. This data supports climate trend analysis, seasonal planning, and long-term risk assessment for industries ranging from agriculture to energy.',
      },
    ],
  },
  sectionSeven: {
    title: 'Experience \nthe Future of Forecasting',
    description: 'HAI-Meteo delivers reliable, enterprise-grade weather forecasts without the technical complexities.',
  },
}
