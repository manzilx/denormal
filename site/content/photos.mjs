// Photographs, keyed by slot. Approved by the user on 2026-09-29 from a
// shortlist of free-licence stock; originals live in the gitignored
// photos-src/, and scripts/process-photos.py writes the toned web
// versions to site/assets/img/<slot>-<width>.{jpg,webp}. Two are cropped:
// Sentinel to keep the workers out of frame, Deployment to keep switchgear
// maker marks out. Credits render on /about/#credits.

const PEXELS = { licence: 'Pexels License', licenceUrl: 'https://www.pexels.com/license/' };

export const PHOTOS = {
  'systems-plant': {
    widths:[640,1024,1600,2400,3840], w:3840, h:2560,
    alt:'Industrial refinery towers and storage tanks beside water, with mountains behind',
    caption:'Refinery and tank farm by the water · stock photograph',
    author:'Nothing Ahead', source:'https://www.pexels.com/photo/industrial-plant-silhouette-against-mountainous-backdrop-38601898/', ...PEXELS,
    note:'stock imagery; no customer, project or endorsement implied; licence checked 2026-09-30',
  },
  'refinery-detail': {
    widths:[640,1024,1600,2400], w:2400, h:1856,
    alt:'Refinery process towers, pipes and steel platforms viewed from below',
    caption:'Process towers and connected pipework · stock photograph',
    author:'Dheeraj Singh', source:'https://www.pexels.com/photo/low-angle-view-of-a-refinery-23369348/', ...PEXELS,
    note:'cropped to exclude an equipment nameplate; no customer, project or endorsement implied; licence checked 2026-09-30',
  },
  nexusref: {
    widths:[640,1024,1600,2400], w:2400, h:1600,
    alt:'Workers handle project drawings at a site table, with faces outside the frame',
    caption:'Project documents with the site team · stock photograph',
    author:'Burst', source:'https://www.pexels.com/photo/person-holding-drafting-paper-544971/', licence:'CC0 1.0', licenceUrl:'https://creativecommons.org/publicdomain/zero/1.0/',
    note:'stock imagery; no team, customer or endorsement implied',
  },
  'engineering-team': {
    widths: [640, 1024, 1600, 2400], w: 2400, h: 1600,
    alt: 'Construction workers in safety vests handle rolled drawings beside a work table; faces are outside the frame',
    caption: 'Plans in the hands of the site team · stock photograph',
    author: 'Burst', source: 'https://www.pexels.com/photo/person-holding-drafting-paper-544971/', licence: 'CC0 1.0', licenceUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    note: 'stock imagery; no team, customer or endorsement implied; no visible faces or branding',
  },
  'site-planning': {
    widths: [640, 1024, 1600], w: 1600, h: 2133,
    alt: 'A worker in a safety vest and helmet measures a wall, photographed from behind without a visible face',
    caption: 'Checking dimensions on site · stock photograph',
    author: 'Kindel Media', source: 'https://www.pexels.com/photo/construction-worker-measuring-wall-8488023/', ...PEXELS,
    note: 'rear view without a visible face; stock imagery; no team, customer or endorsement implied',
  },
  'process-inspection': {
    widths: [640, 1024, 1296], w: 1296, h: 832,
    alt: 'Hands inspect sheet material on a factory work table; faces and branding are outside the crop',
    caption: 'Material inspection on the factory floor · stock photograph',
    author: 'Ruslan Alekso', source: 'https://www.pexels.com/photo/industrial-worker-inspecting-materials-in-factory-35383622/', ...PEXELS,
    note: 'cropped to hands and work surface; stock imagery; no team, customer or endorsement implied',
  },
  // Supplied with the FIELDWORK concept. It is a generated image (its C2PA
  // record names an OpenAI model), so it is credited as illustrative and is
  // never described as a real site.
  landing: {
    widths: [640, 1024, 1536], w: 1536, h: 1024,
    alt: 'Illustrative aerial view of a power station at dusk: cooling towers, two stacks and a switchyard, with transmission lines running across wooded hills towards a river',
    caption: 'Plant and switchyard, illustrative',
    author: 'Denormal Labs', source: '', licence: 'Generated image', licenceUrl: '', note: 'illustrative, not a real site',
  },
  hero: {
    widths: [640, 1024, 1600, 2400], w: 2400, h: 1600,
    alt: 'A coal-fired power station with a cooling tower, chimneys and transmission towers, seen across a field',
    caption: 'Operating plant, seen across the works',
    author: 'Sharath G.', source: 'https://www.pexels.com/photo/thermal-power-station-with-cooling-tower-and-chimneys-7563984/', ...PEXELS,
  },
  pci: {
    widths: [640, 1024, 1600, 2400, 3840], w: 3840, h: 2494,
    alt: 'Connected industrial machinery, valves and pipework inside a plant',
    caption: 'Industrial machinery and connected pipework · stock photograph',
    author: 'Magda Ehlers', source: 'https://www.pexels.com/photo/gray-and-red-industrial-machine-2569839/', ...PEXELS,
    note: 'cropped to exclude the equipment manufacturer mark; stock imagery; no customer, project or endorsement implied; licence checked 2026-09-30',
  },
  onelegal: {
    widths: [640, 1024, 1600, 2400], w: 2400, h: 1600,
    alt: 'Architectural drawings, a sketchbook and drafting tools on a desk',
    caption: 'Drawings and sketches on the desk',
    author: 'Tima Miroshnichenko', source: 'https://www.pexels.com/photo/person-people-building-desk-6615235/', ...PEXELS,
  },
  sentinel: {
    widths: [640, 1024, 1261], w: 1261, h: 945,
    alt: 'Scaffolding around a concrete column under construction, seen from below',
    caption: 'Scaffold around a column under construction',
    author: 'Aravind P.S', source: 'https://www.pexels.com/photo/construction-workers-in-a-construction-site-13890649/', ...PEXELS, note: 'cropped',
  },
  'labour-compliance': {
    widths: [640, 1024, 1600, 2400, 3840], w: 3840, h: 2160,
    alt: 'Two workers in reflective safety vests lean together at a waterfront worksite, viewed from behind',
    caption: 'People at the worksite · stock photograph',
    author: 'Nazmul Haque', source: 'https://www.pexels.com/photo/construction-workers-at-waterfront-site-35861510/', ...PEXELS,
    note: 'rear view without identifiable faces; stock imagery; no employee, customer or endorsement implied',
  },
  deployment: {
    widths: [640, 1024, 1600, 2040], w: 2040, h: 1530,
    alt: 'A corridor lined with electrical switchgear panels',
    caption: 'Switchgear corridor',
    author: 'Shameer Vayalakkad Hydrose', source: 'https://www.pexels.com/photo/industrial-electrical-control-room-interior-33706880/', ...PEXELS, note: 'cropped',
  },
};
