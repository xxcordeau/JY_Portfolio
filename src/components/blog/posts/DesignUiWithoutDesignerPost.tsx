import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const DesignUiWithoutDesignerPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h1>디자이너 없이 UI를 만들 때 제가 하는 방법</h1>

        <h2>배경</h2>

        <p>저는 디자이너와 협업한 프로젝트도 있었지만, 기획부터 디자인, 개발까지 혼자 다 해야 했던 프로젝트가 더 많았어요. WinnTicket이 그랬고, 이 포트폴리오 사이트도 그래요. 처음엔 '디자이너 없이 괜찮은 화면을 만들 수 있을까?' 하는 불안감이 있었는데, 몇 번 경험하면서 나름의 프로세스가 생겼어요.</p>

        <h2>과정과 탐색</h2>

        <p><strong>1단계: 레퍼런스를 많이 보는 게 아니라, 적게 보되 깊게 봐요.</strong></p>

        <p>처음에는 Dribbble이나 Behance에서 레퍼런스를 30~40개씩 모았는데, 그러면 오히려 혼란스러워져요. '이것도 좋고 저것도 좋은데' 하면서 결국 이것저것 섞인 어중간한 결과물이 나왔거든요.</p>

        <p>지금은 레퍼런스를 3~5개만 골라요. 대신 하나를 볼 때 '왜 이게 좋아 보이지?'를 구체적으로 분석해요. 여백이 넉넉해서? 타이포그래피 위계가 명확해서? 색상 수가 적어서? '좋다'는 감각을 구체적인 규칙으로 분해하는 작업이에요.</p>

        <p>예를 들어 이 포트폴리오를 만들 때 Apple 사이트를 레퍼런스로 봤는데, 제가 뽑아낸 건 이런 것들이었어요.</p>

        <ul>
          <li>한 화면에 하나의 메시지만 전달한다</li>
          <li>텍스트 크기의 단계가 명확하다 (제목, 부제, 본문, 캡션)</li>
          <li>배경색 전환으로 섹션을 구분한다</li>
          <li>여백이 콘텐츠보다 많다</li>
        </ul>

        <p>이 네 가지를 기준으로 삼으니까, 이후의 디자인 결정이 훨씬 수월해졌어요.</p>

        <p><strong>2단계: Figma에서 구조를 먼저 잡아요. 색은 나중에.</strong></p>

        <p>디자이너 없이 작업할 때 가장 위험한 건, 처음부터 '예쁘게' 만들려고 하는 거예요. 색 고르고, 그라데이션 넣고, 그림자 조정하고 — 이러다 보면 구조가 엉망인데 겉만 번지르르한 화면이 나와요.</p>

        <p>저는 Figma에서 처음에는 흑백(gray)으로만 작업해요. 색 없이 gray 톤만으로 화면이 읽히면 구조가 잘 잡힌 거예요. 여기서 정보의 위계가 명확하고, 시선의 흐름이 자연스러우면 그때 색을 입혀요. 이 순서를 바꾸면 높은 확률로 시간을 낭비하게 돼요.</p>

        <p><strong>3단계: 타이포그래피 스케일을 먼저 정해요.</strong></p>

        <p>화면에서 가장 많은 면적을 차지하는 건 텍스트예요. 그래서 폰트 크기 체계를 먼저 정하면 나머지가 따라와요. 저는 보통 이런 식으로 시작해요.</p>

        <pre><code>{`캡션:     12px / line-height 1.4
본문:     14px ~ 16px / line-height 1.6
부제:     18px ~ 20px / line-height 1.4
제목:     24px ~ 32px / line-height 1.2
대제목:   40px ~ 56px / line-height 1.1`}</code></pre>

        <p>이 크기들 사이에 명확한 차이가 있어야 사용자가 정보의 우선순위를 직감적으로 파악할 수 있어요. 14px과 16px은 차이가 너무 작아서 위계로 쓰기 어렵고, 16px과 24px은 확실한 차이가 느껴져요.</p>

        <p><strong>4단계: 반드시 실제 데이터로 확인해요.</strong></p>

        <p>Figma에서 'Lorem ipsum'이나 '홍길동'으로 채운 화면은 실제와 완전히 다를 수 있어요. 프로젝트 제목이 한 줄인 줄 알았는데 실제로는 두 줄이 되면 카드 레이아웃이 깨지거든요. 저는 Figma 단계에서부터 실제 콘텐츠를 넣어서 확인해요. 이사 견적서 화면이면 진짜 이사 견적 데이터를, 블로그 목록이면 진짜 블로그 제목을요.</p>

        <h2>배운 점</h2>

        <p>디자이너 없이 UI를 만드는 건 '디자인을 안 하는 것'이 아니라, 디자인의 역할을 개발자가 대신하는 거예요. 그래서 디자인적 사고가 필요해요. 다만 디자이너와 개발자의 접근 방식은 다르고, 개발자의 강점 — 구조적 사고, 재사용 관점, 상태별 대응 — 을 살리면 충분히 좋은 화면을 만들 수 있다고 생각해요.</p>

        <p><strong>감각이 부족하다고 느끼면, 감각 대신 규칙을 만들면 돼요.</strong> 규칙이 일관성을 만들고, 일관성이 '깔끔해 보이는' 느낌을 만들어줘요.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h1>How I Build UI Without a Designer</h1>

      <h2>Background</h2>

      <p>I've worked on projects with designers, but I've had far more projects where I handled everything alone — planning, design, and development. WinnTicket was one of those, and so is this portfolio site. At first, I felt anxious wondering "Can I really build a decent-looking screen without a designer?" But after going through it a few times, I developed my own process.</p>

      <h2>Process and Exploration</h2>

      <p><strong>Step 1: Don't look at many references — look at fewer, but study them deeply.</strong></p>

      <p>Early on, I used to collect 30 to 40 references from Dribbble or Behance, but that actually made things more confusing. I'd think "this one's nice, that one's nice too," and end up with a muddled mix of everything.</p>

      <p>Now I pick just 3 to 5 references. But when looking at each one, I specifically analyze "why does this look good?" Is it because of the generous whitespace? The clear typographic hierarchy? The limited color palette? It's the process of breaking down the feeling of "this looks good" into concrete rules.</p>

      <p>For example, when building this portfolio, I referenced the Apple website. Here's what I extracted from it.</p>

      <ul>
        <li>Each screen conveys only one message</li>
        <li>Text size levels are distinct (title, subtitle, body, caption)</li>
        <li>Sections are separated by background color changes</li>
        <li>There's more whitespace than content</li>
      </ul>

      <p>Using these four points as guidelines made every subsequent design decision much easier.</p>

      <p><strong>Step 2: Establish structure in Figma first. Color comes later.</strong></p>

      <p>The most dangerous thing when working without a designer is trying to make it "pretty" from the start. Picking colors, adding gradients, tweaking shadows — this leads to screens that look polished on the surface but have a broken structure underneath.</p>

      <p>In Figma, I start by working in grayscale only. If the screen reads well with nothing but gray tones — no color — then the structure is solid. Once the information hierarchy is clear and the eye flow feels natural, that's when I add color. Reverse this order, and you'll almost certainly waste time.</p>

      <p><strong>Step 3: Establish the typography scale first.</strong></p>

      <p>Text occupies the most area on any screen. So if you define the font size system first, everything else follows. I usually start with something like this.</p>

      <pre><code>{`Caption:    12px / line-height 1.4
Body:       14px ~ 16px / line-height 1.6
Subtitle:   18px ~ 20px / line-height 1.4
Title:      24px ~ 32px / line-height 1.2
Heading:    40px ~ 56px / line-height 1.1`}</code></pre>

      <p>There needs to be a clear difference between these sizes for users to intuitively grasp information priority. The gap between 14px and 16px is too small to serve as hierarchy, while the difference between 16px and 24px is unmistakable.</p>

      <p><strong>Step 4: Always verify with real data.</strong></p>

      <p>A screen filled with "Lorem ipsum" or placeholder names in Figma can look completely different from reality. You think a project title fits on one line, but in practice it wraps to two lines and breaks the card layout. I use actual content from the Figma stage onward. If it's a moving estimate screen, I use real moving estimate data. If it's a blog list, I use real blog titles.</p>

      <h2>Lessons Learned</h2>

      <p>Building UI without a designer isn't "not doing design" — it's the developer taking on the designer's role. That requires design thinking. However, designers and developers approach things differently, and by leveraging a developer's strengths — structural thinking, a reusability mindset, state-by-state handling — you can absolutely build great interfaces.</p>

      <p><strong>If you feel like you lack design intuition, create rules instead.</strong> Rules create consistency, and consistency creates that "clean" feeling.</p>
    </Content>
  );
};
