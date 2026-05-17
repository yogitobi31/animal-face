export type AnimalFeatureWeights = {
  softness: number;
  sharpness: number;
  brightness: number;
  calmness: number;
  mystique: number;
  playfulness: number;
};

export type AnimalResult = {
  id: string;
  name: string;
  baseAnimal: string;
  category: string;
  moodTags: string[];
  tagline: string;
  description: string;
  palette: string[];
  illustrationKey: string;
  featureWeights: AnimalFeatureWeights;
};

export const animalResults: AnimalResult[] = [
  {
    id: 'moonlight-cat',
    name: '달빛 고양이상',
    baseAnimal: '고양이',
    category: '고양이',
    moodTags: ['차분한', '도도한', '신비로운'],
    tagline: '고요한 눈빛에 은은한 카리스마가 흐르는 타입',
    description:
      '부드러움과 날카로움의 균형이 좋아 차분하면서도 존재감 있는 인상을 줍니다.',
    palette: ['#F6F1FF', '#C5B8FF', '#6B5CA5'],
    illustrationKey: 'moon-fox-cat',
    featureWeights: {
      softness: 72,
      sharpness: 68,
      brightness: 52,
      calmness: 75,
      mystique: 84,
      playfulness: 40,
    },
  },
  {
    id: 'sunny-puppy',
    name: '햇살 강아지상',
    baseAnimal: '강아지',
    category: '강아지',
    moodTags: ['밝은', '친근한', '장난기 있는'],
    tagline: '주변을 환하게 만드는 따뜻하고 경쾌한 타입',
    description:
      '밝기와 장난기가 높아 첫인상에서 편안함과 활기가 동시에 느껴집니다.',
    palette: ['#FFF2CC', '#FFD27D', '#FF9F45'],
    illustrationKey: 'sunny-dog',
    featureWeights: {
      softness: 70,
      sharpness: 35,
      brightness: 90,
      calmness: 48,
      mystique: 30,
      playfulness: 88,
    },
  },
  {
    id: 'misty-owl',
    name: '은안개 올빼미상',
    baseAnimal: '올빼미',
    category: '올빼미',
    moodTags: ['고요한', '지적인', '신중한'],
    tagline: '맑고 차분한 분위기에 깊은 집중력이 돋보이는 타입',
    description:
      '차분함과 신비감이 중심이 되는 무드로, 또렷한 인상에 안정적인 에너지를 더합니다.',
    palette: ['#E8EDF4', '#A7B5C7', '#4E5D73'],
    illustrationKey: 'mist-owl',
    featureWeights: {
      softness: 46,
      sharpness: 62,
      brightness: 44,
      calmness: 86,
      mystique: 78,
      playfulness: 28,
    },
  },
];
