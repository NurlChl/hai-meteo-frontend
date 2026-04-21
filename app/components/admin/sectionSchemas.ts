export type SectionFieldType = 'text' | 'textarea' | 'link' | 'image' | 'icon' | 'video' | 'list'

export interface SectionFieldSchema {
  key: string
  label: string
  type: SectionFieldType
  helperText?: string
  itemFields?: SectionFieldSchema[]
}

export interface SectionSchema {
  sectionKey: string
  fields: SectionFieldSchema[]
}

function text(key: string, label: string, type: SectionFieldType = 'text', helperText?: string): SectionFieldSchema {
  return {
    key,
    label,
    type,
    helperText,
  }
}

function media(key: string, label: string, type: 'image' | 'icon' | 'video', helperText?: string): SectionFieldSchema {
  return {
    key,
    label,
    type,
    helperText,
  }
}

function list(key: string, label: string, itemFields: SectionFieldSchema[], helperText?: string): SectionFieldSchema {
  return {
    key,
    label,
    type: 'list',
    itemFields,
    helperText,
  }
}

const schemas: Record<string, SectionSchema> = {
  'landing-section-one': {
    sectionKey: 'landing-section-one',
    fields: [
      text('title', 'Title', 'textarea'),
      text('description', 'Description', 'textarea'),
      media('backgroundVideo', 'Background Video', 'video'),
      media('showcaseVideo', 'Showcase Video', 'video'),
    ],
  },
  'landing-section-two': {
    sectionKey: 'landing-section-two',
    fields: [
      text('title', 'Title', 'textarea'),
      text('description', 'Description'),
      list('features', 'Features', [
        text('title', 'Title', 'textarea'),
        text('description', 'Description', 'textarea'),
        media('icon', 'Icon', 'icon'),
      ]),
    ],
  },
  'landing-section-three': {
    sectionKey: 'landing-section-three',
    fields: [
      text('title', 'Title', 'textarea'),
      text('description', 'Description'),
      media('timelineMarkerImage', 'Timeline Marker', 'image'),
      list('solutions', 'Solutions', [
        text('id', 'ID'),
        text('title', 'Title', 'textarea'),
        text('description', 'Description', 'textarea'),
        media('video', 'Video', 'video'),
      ]),
    ],
  },
  'landing-section-four': {
    sectionKey: 'landing-section-four',
    fields: [
      text('title', 'Title', 'textarea'),
      text('description', 'Description'),
      media('radarImage', 'Radar Image', 'image'),
      media('logoImage', 'Center Logo', 'image'),
      list('technologies', 'Technologies', [
        text('title', 'Title', 'textarea'),
        text('description', 'Description', 'textarea'),
        media('icon', 'Icon', 'icon'),
      ]),
    ],
  },
  'landing-section-five': {
    sectionKey: 'landing-section-five',
    fields: [
      text('title', 'Title', 'textarea'),
      text('date', 'Date'),
      text('description', 'Description', 'textarea'),
      media('image', 'Image', 'image'),
      text('link', 'Link', 'link'),
    ],
  },
  'landing-section-six': {
    sectionKey: 'landing-section-six',
    fields: [
      text('title', 'Title', 'textarea'),
      text('description', 'Description', 'textarea'),
      list('faqs', 'FAQs', [
        text('question', 'Question', 'textarea'),
        text('answer', 'Answer', 'textarea'),
      ]),
    ],
  },
  'landing-section-seven': {
    sectionKey: 'landing-section-seven',
    fields: [
      text('title', 'Title', 'textarea'),
      text('description', 'Description', 'textarea'),
      media('backgroundImage', 'Background Image', 'image'),
      media('lineImage', 'Decorative Line Image', 'image'),
      media('demoVideo', 'Demo Video', 'video'),
    ],
  },
  'features-section-one': {
    sectionKey: 'features-section-one',
    fields: [
      text('title', 'Title', 'textarea'),
      text('description', 'Description', 'textarea'),
      media('backgroundImage', 'Background Image', 'image'),
      media('video', 'Hero Video', 'video'),
    ],
  },
  'features-section-two': {
    sectionKey: 'features-section-two',
    fields: [
      text('title', 'Title', 'textarea'),
      list('items', 'Items', [
        text('id', 'ID'),
        text('title', 'Title', 'textarea'),
        text('description', 'Description', 'textarea'),
        media('icon', 'Icon', 'icon'),
        media('image', 'Image', 'image'),
      ]),
    ],
  },
  'features-section-three': {
    sectionKey: 'features-section-three',
    fields: [
      text('title', 'Title', 'textarea'),
      list('topFeatures', 'Top Features', [
        text('id', 'ID'),
        text('title', 'Title', 'textarea'),
        text('description', 'Description', 'textarea'),
        media('image', 'Image', 'image'),
      ]),
      list('bottomFeatures', 'Bottom Features', [
        text('id', 'ID'),
        text('title', 'Title', 'textarea'),
        text('description', 'Description', 'textarea'),
        media('image', 'Image', 'image'),
        media(
          'secondaryImage',
          'Secondary Image',
          'image',
          'Only used for the first bottom feature item.',
        ),
      ]),
    ],
  },
  'features-section-four': {
    sectionKey: 'features-section-four',
    fields: [
      text('title', 'Title', 'textarea'),
      list('dashboardFeatures', 'Dashboard Features', [
        text('title', 'Title', 'textarea'),
        text('description', 'Description', 'textarea'),
        media('icon', 'Icon', 'icon'),
        media('video', 'Video', 'video'),
      ]),
    ],
  },
  'technology-section-one': {
    sectionKey: 'technology-section-one',
    fields: [
      text('title', 'Title', 'textarea'),
      text('description', 'Description', 'textarea'),
      media('image', 'Image', 'image'),
      media('backgroundImage', 'Background Image', 'image'),
    ],
  },
  'technology-section-two': {
    sectionKey: 'technology-section-two',
    fields: [
      text('title', 'Title', 'textarea'),
      text('description', 'Description', 'textarea'),
      list('items', 'Items', [
        text('title', 'Title', 'textarea'),
        text('description', 'Description', 'textarea'),
        media('icon', 'Icon', 'icon'),
        media('image', 'Image', 'image'),
      ]),
    ],
  },
  'technology-section-three': {
    sectionKey: 'technology-section-three',
    fields: [
      text('title', 'Title', 'textarea'),
      text('description', 'Description', 'textarea'),
      media('image', 'Image', 'image'),
      list('items', 'Items', [
        text('title', 'Title', 'textarea'),
        text('description', 'Description', 'textarea'),
        media('icon', 'Icon', 'icon'),
      ]),
    ],
  },
  'technology-section-four': {
    sectionKey: 'technology-section-four',
    fields: [
      text('title', 'Title', 'textarea'),
      text('description', 'Description', 'textarea'),
      media('image', 'Image', 'image'),
    ],
  },
  'partnership-section-one': {
    sectionKey: 'partnership-section-one',
    fields: [
      text('title', 'Title', 'textarea'),
      text('description', 'Description', 'textarea'),
      media('image', 'Image', 'image'),
      media('backgroundImage', 'Background Image', 'image'),
      text('ctaText', 'CTA Text'),
      text('ctaHref', 'CTA Link', 'text', 'Use a page anchor like #contact-form'),
    ],
  },
  'partnership-section-two': {
    sectionKey: 'partnership-section-two',
    fields: [
      text('title', 'Title', 'textarea'),
      text('description', 'Description', 'textarea'),
      list('items', 'Items', [
        text('title', 'Title', 'textarea'),
        text('description', 'Description', 'textarea'),
        media('icon', 'Icon', 'icon'),
      ]),
    ],
  },
  'partnership-section-three': {
    sectionKey: 'partnership-section-three',
    fields: [
      text('title', 'Title', 'textarea'),
      text('description', 'Description', 'textarea'),
      media('video', 'Background Video', 'video'),
      text('submitText', 'Submit Text'),
    ],
  },
}

export function getSectionSchema(sectionKey: string): SectionSchema | null {
  return schemas[sectionKey] || null
}
