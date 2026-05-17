import type { AnimalCard } from '../types/animal'

const p = (roundness:number,sharpness:number,softness:number,elegance:number,playfulness:number,calmness:number,brightness:number,mystery:number,warmth:number)=>({roundness,sharpness,softness,elegance,playfulness,calmness,brightness,mystery,warmth})

const baseAnimals = ['고양이','강아지','여우','늑대','토끼','사슴','곰','수달','라쿤','다람쥐','올빼미','백조','표범','돌고래','호랑이','판다'] as const
const personalityLayers = ['도도한','햇살 같은','고요한','포근한','신비로운','차분한','맑은','장난기 있는'] as const
const emotionalLayers = ['눈꽃','달그림자','새벽빛','은안개','별결','호수빛','밤안개','유리숲'] as const

const illustrationKeys = [
  'proud-cat','sunny-dog','snow-arctic-fox','moon-fox-cat','peach-rabbit','forest-deer','honey-bear','river-otter',
  'city-raccoon','maple-squirrel','mist-owl','pearl-swan','midnight-panther','wave-dolphin','ember-tiger','ink-panda',
  'snow-fox-rabbit','moon-cat-fox','dawn-deer-rabbit','mist-wolf-cat','lake-otter-deer','night-panther-fox','star-raccoon-owl','glass-swan-dolphin',
  'aurora-tiger-wolf','milk-panda-bear','sunset-dog-otter','frost-owl-swan','amber-squirrel-rabbit','noir-panther-cat','mint-dolphin-fox','rose-deer-cat'
] as const

const palettes = ['rose-cream','silver-indigo','apricot-mint','frost-blue','navy-lilac','black-violet','pearl','moss-green','sunny-yellow','city-navy'] as const

const toId = (value:string)=>value.replace(/\s+/g,'-').replace(/[^a-zA-Z0-9가-힣-]/g,'').toLowerCase()
const rarityByIndex = (index:number): AnimalCard['rarity'] => index % 11 === 0 ? 'hidden' : index % 4 === 0 ? 'rare' : 'common'

const blendPair = (index:number) => {
  const a = baseAnimals[index % baseAnimals.length]
  const b = baseAnimals[(index * 5 + 3) % baseAnimals.length]
  return a === b ? [a] : [a,b]
}

export const animalCards: AnimalCard[] = Array.from({length: 96}, (_, index) => {
  const personality = personalityLayers[index % personalityLayers.length]
  const emotional = emotionalLayers[index % emotionalLayers.length]
  const blend = blendPair(index)
  const baseAnimal = blend[0]
  const category = blend.length === 1 ? baseAnimal : `${blend[0]}·${blend[1]} 하이브리드`
  const name = index % 3 === 0 ? `${emotional} ${blend.join('')}` : `${personality} ${blend.join('')}`

  return {
    id: toId(`${name}-${index}`),
    name,
    baseAnimal,
    category,
    moodTags: [personality, emotional, blend[0], blend[1] ?? '단일상'],
    tagline: `${emotional} 결이 스며든 ${personality} 무드`,
    description: `${blend.join('·')}의 인상을 바탕으로 색감·장식·질감을 차별화해 아카이브형 결과 경험을 강화한 카드입니다.`,
    palette: palettes[index % palettes.length],
    illustrationKey: illustrationKeys[index % illustrationKeys.length],
    featureWeights: p(
      30 + ((index * 17) % 66),
      20 + ((index * 19) % 72),
      28 + ((index * 23) % 65),
      35 + ((index * 13) % 60),
      25 + ((index * 29) % 68),
      30 + ((index * 31) % 63),
      30 + ((index * 11) % 64),
      18 + ((index * 37) % 76),
      28 + ((index * 41) % 65)
    ),
    rarity: rarityByIndex(index),
  }
})
