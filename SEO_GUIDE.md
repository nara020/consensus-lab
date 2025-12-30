# Consensus Lab - SEO & 글로벌 노출 가이드

## 1. 배포 후 즉시 해야 할 것

### Google Search Console (필수!)
1. **https://search.google.com/search-console** 접속
2. "속성 추가" → URL 접두어 선택 → `https://consensus-lab.vercel.app` 입력
3. **소유권 확인 방법** (아래 중 하나 선택):
   - **HTML 태그** (추천): 제공되는 meta 태그를 `layout.tsx`에 추가
   - **도메인 공급업체**: Vercel DNS 설정에서 TXT 레코드 추가
4. 확인 후 **사이트맵 제출**:
   - 왼쪽 메뉴 "Sitemaps" 클릭
   - `https://consensus-lab.vercel.app/sitemap.xml` 입력 → 제출

### Bing Webmaster Tools
1. **https://www.bing.com/webmasters** 접속
2. Google Search Console에서 가져오기 (가장 쉬움)
3. 또는 직접 URL 추가 후 사이트맵 제출

### Google 색인 요청 (빠른 노출)
1. Search Console → URL 검사 → 메인 URL 입력
2. "색인 생성 요청" 클릭
3. `/history` 페이지도 동일하게 요청

---

## 2. 소셜 미디어 등록

### Twitter/X
- 사이트 링크 트윗하기
- Twitter Card Validator로 미리보기 확인: https://cards-dev.twitter.com/validator

### LinkedIn
- 프로젝트 포스트 작성
- Post Inspector로 확인: https://www.linkedin.com/post-inspector/

### Reddit
- r/ethereum, r/cryptocurrency, r/programming 등에 공유
- 교육용 콘텐츠로 가치 있게 소개

### Hacker News
- "Show HN" 포스트로 공유
- 제목 예시: "Show HN: Interactive 3D Visualizations of 10+ Blockchain Consensus Algorithms"

---

## 3. 개발자 커뮤니티 등록

### Product Hunt
1. https://www.producthunt.com 에서 제품 등록
2. 카테고리: Developer Tools, Education, Blockchain
3. 좋은 스크린샷/GIF 준비

### GitHub
1. Repository topics 추가:
   - `blockchain`, `consensus`, `visualization`, `education`, `ethereum`, `bitcoin`, `web3`
2. README에 배지 추가 (Vercel, License 등)
3. GitHub Pages로 데모 링크 추가

### Dev.to / Medium
- 프로젝트 소개 글 작성
- "How I built an interactive blockchain consensus visualizer" 같은 제목

---

## 4. 블록체인 커뮤니티

### Discord 서버들
- Ethereum Discord
- Cosmos Network Discord
- Avalanche Discord
- Sui Discord

### Telegram 그룹들
- 각 체인의 개발자 그룹

### Forum
- Ethereum Research (ethresear.ch)
- Cosmos Forum

---

## 5. 백링크 확보

### 교육 사이트
- LearnWeb3
- Buildspace
- Alchemy University

### 개발자 리소스 사이트
- Awesome Ethereum 리스트 PR
- Awesome Blockchain 리스트 PR

---

## 6. 모니터링

### Google Search Console에서 확인할 것
- **실적**: 클릭수, 노출수, CTR, 평균 게재순위
- **색인 생성**: 색인된 페이지 수
- **개선 사항**: 모바일 사용성, Core Web Vitals

### Google Analytics (선택)
1. GA4 계정 생성
2. 측정 ID를 `layout.tsx`에 추가

---

## 7. 키워드 타겟팅

### 주요 타겟 키워드
```
blockchain consensus visualization
proof of work explained
proof of stake visualization
ethereum consensus mechanism
tendermint consensus
avalanche snowball protocol
layer 2 rollup explained
blockchain education
consensus algorithm comparison
```

### 롱테일 키워드
```
how does proof of stake work ethereum
bitcoin proof of work mining visualization
difference between optimistic and zk rollup
tendermint vs pbft consensus
avalanche consensus explained
sui narwhal bullshark consensus
```

---

## 8. 완료된 SEO 설정 체크리스트

- [x] Meta title & description
- [x] Open Graph tags
- [x] Twitter Cards
- [x] sitemap.xml
- [x] robots.txt
- [x] JSON-LD 구조화 데이터 (WebApplication, Organization, FAQ)
- [x] llms.txt (AI 크롤러용)
- [x] 동적 OG 이미지 생성
- [x] 다국어 지원 (en/ko)
- [x] Canonical URL
- [x] 60+ SEO 키워드

---

## 9. 추가 개선 사항 (선택)

### Performance
- Lighthouse 점수 90+ 유지
- Core Web Vitals 최적화

### Accessibility
- ARIA 레이블 추가
- 키보드 네비게이션

### PWA
- manifest.json 추가
- Service Worker로 오프라인 지원

---

## 빠른 시작 체크리스트

```bash
# 1. 배포
vercel --prod

# 2. 배포 후 즉시
- [ ] Google Search Console 등록 & 사이트맵 제출
- [ ] Bing Webmaster 등록
- [ ] URL 색인 요청

# 3. 첫 주 내
- [ ] Twitter/X에 공유
- [ ] Reddit에 공유
- [ ] GitHub topics 업데이트

# 4. 첫 달 내
- [ ] Product Hunt 출시
- [ ] Dev.to/Medium 글 작성
- [ ] 블록체인 커뮤니티 공유
```

---

## 유용한 도구

- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Schema Markup Validator**: https://validator.schema.org/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Lighthouse**: Chrome DevTools > Lighthouse
- **PageSpeed Insights**: https://pagespeed.web.dev/

---

Good luck! 🚀
