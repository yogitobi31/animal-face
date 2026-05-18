# PR #21 이후 PNG/illustrationKey 매칭 점검

## 결론
- `public/animals`의 PNG 16개 중 `animalResults`의 `illustrationKey`와 정확히 일치하는 키는 14개.
- 누락된 2개 PNG는 아래와 같음.

## 누락 파일 상세

1. 파일명: `golden-lion.png`
   - 대응해야 하는 결과명(의미 기준): 황금 사자/골든 라이언 계열 결과
   - 현재 `animalResults` 존재 여부: 없음
   - 현재 데이터 상태: 현재 데이터에 없음

2. 파일명: `silk-weasel.png`
   - 대응해야 하는 결과명(의미 기준): 실크 족제비/위즐 계열 결과
   - 현재 `animalResults` 존재 여부: 없음
   - 현재 데이터 상태: 현재 데이터에 없음

## 검증 메모
- `black-raven.png`는 `illustrationKey: black-raven` 결과에 존재.
- `starlight-swan.png`는 `illustrationKey: starlight-swan` 결과에 존재.
- 의미 불일치 매핑은 수행하지 않음.
