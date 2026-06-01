// Curated Unsplash photo IDs by topic for blog post hero images
const IMAGES = {
  // Korean categories
  '무료서식': 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80',
  '무료템플릿': 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80',
  '툴소개': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80',
  // English categories
  'tools': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  'templates': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  'productivity': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80',
  'default': 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&q=80',
}

export function getBlogImage(category) {
  return IMAGES[category] || IMAGES['default']
}
