/**
 * Photographs used on the site, with the licence record for each.
 *
 * Every image comes from Wikimedia Commons, where the licence, creator and source
 * are recorded on the file page linked in `source`. They were verified on
 * 22 October 2026. Each was cropped, resized and converted to WebP for the web;
 * for the two CC BY-SA images that adaptation is shared under the same licence.
 *
 * All photographs are illustrative. None documents a finding of this research,
 * and none shows a participant, Maria, or any person named on the site.
 */
import heroLg from '../assets/media/hero-callcentre-1920.webp';
import heroSm from '../assets/media/hero-callcentre-960.webp';
import parkLg from '../assets/media/b-cebu-it-park-1400.webp';
import parkSm from '../assets/media/b-cebu-it-park-760.webp';
import tesdaLg from '../assets/media/f-tesda-vr-welding-1200.webp';
import tesdaSm from '../assets/media/f-tesda-vr-welding-680.webp';
import labLg from '../assets/media/k-computer-lab-1920.webp';
import labSm from '../assets/media/k-computer-lab-960.webp';

export interface Media {
  key: string;
  src: string; srcSet: string; width: number; height: number;
  alt: string;
  caption: string;
  title: string;           // the work's title on Wikimedia Commons, for attribution
  creator: string;
  license: string; licenseUrl?: string;
  source: string;          // the Commons file page
  adapted: string;         // what was done to it
}

export const MEDIA = {
  hero: {
    key: 'hero', src: heroLg, srcSet: `${heroSm} 960w, ${heroLg} 1920w`, width: 1920, height: 893,
    alt: 'Employees at tables in the pantry of a call centre in Manila.',
    caption: 'Employees in a common pantry in a call centre in Manila.',
    title: 'A common pantry in a call center in Manila',
    creator: 'GerryYabes', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:A_common_pantry_in_a_call_center_in_Manila.jpg',
    adapted: 'Cropped, resized and tinted; adaptation shared under CC BY-SA 4.0.',
  },
  itPark: {
    key: 'itPark', src: parkLg, srcSet: `${parkSm} 760w, ${parkLg} 1400w`, width: 1400, height: 788,
    alt: 'Office towers of Cebu IT Park, Cebu City, seen from above.',
    caption: 'Cebu IT Park, Cebu City, one of the business districts where IT-BPM firms operate.',
    title: 'Cebu IT Park top view Padrigas (Lahug, Cebu City; 01-09-2024)',
    creator: 'Patrickroque01', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Cebu_IT_Park_top_view_Padrigas_(Lahug,_Cebu_City;_01-09-2024).jpg',
    adapted: 'Cropped and resized; adaptation shared under CC BY-SA 4.0.',
  },
  tesda: {
    key: 'tesda', src: tesdaLg, srcSet: `${tesdaSm} 680w, ${tesdaLg} 1200w`, width: 1200, height: 952,
    alt: 'Two trainees in coveralls practising on virtual-reality welding simulators in front of a wall of welding diagrams.',
    caption: 'Trainees on virtual-reality welding simulators at a TESDA training centre in Taguig City, October 2025.',
    title: '2025-10-10 – PBBM reaffirms support for globally competitive skills dev’t thru TESDA (04)',
    creator: 'Presidential Communications Office', license: 'Public domain',
    source: 'https://commons.wikimedia.org/wiki/File:2025-10-10_%E2%80%93_PBBM_reaffirms_support_for_globally_competitive_skills_dev%E2%80%99t_thru_TESDA_(04).jpg',
    adapted: 'Cropped from a photograph taken during an official inspection visit; the officials and the PCO watermark are outside the crop. Resized.',
  },
  lab: {
    key: 'lab', src: labLg, srcSet: `${labSm} 960w, ${labLg} 1920w`, width: 1920, height: 665,
    alt: 'Rows of computer workstations in a university computer laboratory.',
    caption: 'A computer laboratory at De La Salle University – Dasmariñas.',
    title: 'De La Salle University – Dasmariñas (DLSU–D) Information and Communications Technology Center (ICTC) laboratory room 203 (ICT203) — normal view',
    creator: 'UndueMarmot', license: 'CC0 1.0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    source: 'https://commons.wikimedia.org/wiki/File:De_La_Salle_University_%E2%80%93_Dasmari%C3%B1as_(DLSU%E2%80%93D)_Information_and_Communications_Technology_Center_(ICTC)_laboratory_room_203_(ICT203)_%E2%80%94_normal_view.jpg',
    adapted: 'Cropped and resized.',
  },
} satisfies Record<string, Media>;
