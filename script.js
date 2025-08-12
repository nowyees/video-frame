// 1. 기본 설정
const canvas = document.getElementById('scroll-canvas');
const context = canvas.getContext('2d');

// 캔버스 해상도 설정 (이미지의 원래 크기와 맞추는 것이 좋음)
canvas.width = 1920;
canvas.height = 1080;

// ✅ [필수 수정] 실제 이미지의 총 개수로 이 숫자를 변경하세요!
const frameCount = 150; 

// 이미지 경로를 생성하는 함수
const currentFrame = index => (
    `./images/0406.55.${index + 1}.png`
);

// 2. 이미지 미리 불러오기 (Preloading)
const images = [];
const frame = { current: 0 }; 

for (let i = 0; i < frameCount; i++) {
    const img = new Image();
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
    
    // ✅ 이미지가 정상적으로 로드되었을 때만 그리도록 방어 코드를 추가했습니다.
    // 'broken' state 오류를 방지합니다.
    if (img && img.complete && img.naturalWidth !== 0) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

// 첫 번째 이미지가 로드되면 첫 화면을 그립니다.
images[0].onload = render;

// ✅ [오류 추적 기능 추가]
// 모든 이미지에 에러 핸들러를 추가해서, 만약 특정 이미지가 깨졌거나
// 로드에 실패하면 콘솔에 어떤 파일이 문제인지 정확히 알려줍니다.
images.forEach((img) => {
    img.onerror = () => {
        console.error(`[오류] 이 이미지 파일을 불러올 수 없습니다 (깨졌거나 경로가 잘못됨): ${img.src}`);
    };
});
