// 1. 기본 설정
const canvas = document.getElementById('scroll-canvas');
const context = canvas.getContext('2d');

// 캔버스 해상도 설정 (이미지의 원래 크기와 맞추는 것이 좋음)
canvas.width = 1920;
canvas.height = 1080;

// ==========================================================
// ✅ [수정] 1. 총 이미지 프레임 수 (실제 개수로 변경!)
const frameCount = 150; // 예시: 실제 프레임 수로 변경하세요!
// ==========================================================

// 이미지 경로를 생성하는 함수
const currentFrame = index => (
    // ==========================================================
    // ✅ [수정] 2. 이미지 파일 경로와 이름 형식 (png로 변경)
    `./images/0406.55.${index + 1}.png`
    // 예: 0406.55.1.png, 0406.55.2.png ...
    // ==========================================================
);

// 2. 이미지 미리 불러오기 (Preloading)
const images = [];
// GSAP이 조작할 가상의 객체
const frame = { current: 0 };

for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
}

// 3. GSAP ScrollTrigger로 애니메이션 설정
gsap.to(frame, {
    current: frameCount - 1, // 0부터 시작해서 마지막 프레임(frameCount - 1)까지
    roundProps: "current",   // current 값을 정수로 만듦
    ease: "none",            // 일정한 속도로
    scrollTrigger: {
        trigger: ".scroll-container", // 애니메이션의 기준이 되는 요소
        start: "top top",             // .scroll-container의 맨 위가 화면 맨 위에 닿을 때 시작
        end: "bottom bottom",         // .scroll-container의 맨 아래가 화면 맨 아래에 닿을 때 끝
        scrub: 0.8,                   // 스크롤과 애니메이션을 부드럽게 연결 (숫자가 클수록 더 부드러움)
        pin: true,                    // 스크롤 동안 .scroll-container를 화면에 고정
        onUpdate: render,             // 스크롤 할 때마다 render 함수 호출
    }
});

// 4. 캔버스에 이미지 그리기 함수
function render() {
    // frame.current는 GSAP이 업데이트하는 현재 프레임 번호
    const img = images;
    if (img && img.complete) {
        context.clearRect(0, 0, canvas.width, canvas.height); // 이전 프레임 지우기
        context.drawImage(img, 0, 0, canvas.width, canvas.height); // 새 프레임 그리기
    }
}

// 첫 프레임 미리 그리기
images.onload = render;
