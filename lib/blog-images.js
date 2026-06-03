const IMAGES = {
  // English categories
  'alternatives':     'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  'google-workspace': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  'ai-tools':         'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
  'productivity':     'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80',
  // Korean categories
  '툴비교':           'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  '구글활용':         'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  'AI활용':           'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
  '협업팁':           'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
  'default':          'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&q=80',
}

export function getBlogImage(category) {
  return IMAGES[category] || IMAGES['default']
}
