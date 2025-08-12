// 1. 기본 설정
const canvas = document.getElementById('scroll-canvas');
const context = canvas.getContext('2d');

// 캔버스 해상도 설정
canvas.width = 1920;
canvas.height = 1080;

// =================================================================
// ✅ [최종 테스트]
// 문제의 원인을 확실히 파악하기 위해, 오류가 없는
// placeholder 이미지 150개를 불러오도록 변경했습니다.
const frameCount = 150; 
// =================================================================

// 이미지 경로를 생성하는 함수
const currentFrame = index => (
    // ✅ [최종 테스트] 테스트용 이미지 경로로 변경
    `https://placehold.co/1920x1080/000000/FFFFFF?text=Frame+${index + 1}`
);

// 2. 이미지 미리 불러오기 (Preloading)
const images = [];
const frame = { current: 0 }; 

for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    // 다른 도메인의 이미지를 사용하기 위한 설정
    img.crossOrigin = "anonymous";
    img.src = currentFrame(i);
    images.push(img);
}

// 3. GSAP ScrollTrigger로 애니메이션 설정
gsap.to(frame, {
    current: frameCount - 1,
    roundProps: "current",
    ease: "none",
    scrollTrigger: {
        trigger: ".scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        pin: true,
        onUpdate: render,
    }
});

// 4. 캔버스에 이미지 그리기 함수
function render() {
    const img = images[frame.current];
    if (img && img.complete && img.naturalWidth !== 0) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

// 첫 번째 이미지가 로드되면 첫 화면을 그립니다.
images[0].onload = render;

// [오류 추적 기능]
images.forEach((img) => {
    img.onerror = () => {
        console.error(`[오류] 이 이미지 파일을 불러올 수 없습니다: ${img.src}`);
    };
});
