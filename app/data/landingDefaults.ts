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
  image: LandingImage
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
}

export interface LandingSectionTwoContent {
  title: string
  description: string
  features: LandingFeature[]
}

export interface LandingSectionThreeContent {
  title: string
  description: string
  solutions: LandingSolution[]
}

export interface LandingSectionFourContent {
  title: string
  description: string
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

export const landingDefaults: LandingSectionsData = {
  sectionOne: {
    title: 'The Next Enterprise Grade \nAI Weather',
    description: 'Forecast the future with AI where intelligent insights meet effortless weather precision.',
    backgroundImage: {
      url: '/images/landing/earth_background.jpg',
      alt: 'Earth Background',
    },
  },
  sectionTwo: {
    title: 'Empowering the next generation of weather intelligence with AI.',
    description: 'Features',
    features: [
      {
        title: 'Personalized \nLocations',
        description: 'Get precise weather data for your exact location.',
        icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z M12 8v8l4-4',
      },
      {
        title: 'Comprehensive \nForecast',
        description: 'Access complete weather intelligence from hourly and daily forecasts.',
        icon: 'M17 19a5 5 0 001.07-9.88c-.68-2.6-3.05-4.12-5.57-4.12-2.13 0-4.06 1.05-5.07 2.76C4.09 7.82 2 10.13 2 13c0 3.31 2.69 6 6 6h9zm-5-3c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3z m-3.5-3.5l1.5 1.5M6 6l1.5 1.5',
      },
      {
        title: 'AI-Powered \nInsight',
        description: 'Leverage artificial intelligence to uncover hidden patterns and trends.',
        icon: 'M12 2a9 9 0 019 9c0 3.96-2.52 7.35-6.07 8.55-.38.13-.67.43-.67.83v.62c0 .55-.45 1-1 1h-2.52c-.55 0-1-.45-1-1v-.62c0-.4-.29-.7-.67-.83A9.006 9.006 0 013 11a9 9 0 019-9zm0 2a7 7 0 00-7 7c0 2.21 1.03 4.18 2.66 5.5l.84.68V20h5v-2.82l.84-.68A7.003 7.003 0 0019 11a7 7 0 00-7-7z',
      },
      {
        title: 'Historical \nTrends',
        description: 'Analyze historical weather data to understand long-term trends.',
        icon: 'M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0113 21a9 9 0 010-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z',
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
        image: {
          url: '/images/solution/mining.jpg',
          alt: 'Mining Industry',
        },
        video: '/video/solution-in-action/Mining_Machinery_fhd_1223195.mp4',
      },
      {
        id: 'oil_gas',
        title: 'Oil & Gas',
        description: 'Strengthen asset protection and field operations with high-accuracy, real-time weather forecasting powered by AI.',
        image: {
          url: '/images/solution/oil_gas.jpg',
          alt: 'Oil & Gas',
        },
        video: '/video/solution-in-action/Oil and gass Compressed.mp4',
      },
      {
        id: 'agriculture',
        title: 'Agriculture',
        description: 'Optimize crop planning with AI-driven weather insights tailored for every planting and harvesting cycle.',
        image: {
          url: '/images/solution/agriculture.jpg',
          alt: 'Agriculture',
        },
        video: '/video/solution-in-action/Agriculture.mp4',
      },
    ],
  },
  sectionFour: {
    title: 'HAI-Meteo uses real-time data and history record for smart forecasts.',
    description: 'Technology',
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
      url: '/images/news/storm.jpg',
      alt: 'News Image',
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
    backgroundImage: {
      url: '/images/technology/sectionone/BackgroundSectionOne.png',
      alt: 'Background pattern',
    },
  },
}
